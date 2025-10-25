import { defineStore } from 'pinia'

/**
 * Utilidad: intentamos parsear como JSON, si falla devolvemos el dato original.
 */
function safeParseMessage(evData) {
  try {
    if (typeof evData === 'string') {
      return { type: 'json', data: JSON.parse(evData), raw: evData }
    }
    if (evData instanceof ArrayBuffer) {
      // Si te interesa, aquí puedes decodificar como texto o DataView
      return { type: 'binary', data: evData, raw: evData }
    }
    // Algunos navegadores entregan Blob
    if (evData instanceof Blob) {
      return { type: 'blob', data: evData, raw: evData }
    }
    // Último recurso: texto plano
    return { type: 'text', data: String(evData), raw: evData }
  } catch {
    // No era JSON válido
    return { type: 'text', data: evData, raw: evData }
  }
}

/**
 * Backoff exponencial con jitter.
 * intento: 0,1,2,3...
 */
function computeBackoffMs(intento, { base = 500, max = 10000 } = {}) {
  const exp = Math.min(max, base * Math.pow(2, intento))
  const jitter = Math.floor(Math.random() * 0.25 * exp)
  return Math.min(max, exp + jitter)
}

export const useWsDataStore = defineStore('wsData', {
  state: () => ({
    // Config
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001/scoreboard', // ajusta a tu servidor
    protocols: undefined, // por si tu WS usa subprotocolos
    autoReconnect: true,
    maxHistory: 200, // mensajes que guardamos en memoria
    heartbeatMs: 15000, // 0 para desactivar heartbeat
    heartbeatPayload: 'ping', // personalizado si el servidor espera otra cosa
    // Estado runtime
    status: 'idle', // 'idle' | 'connecting' | 'open' | 'closing' | 'closed' | 'error'
    socket: /** @type {WebSocket|null} */ (null),
    lastMessage: /** @type {any} */ (null),
    history: /** @type {any[]} */ ([]),
    lastError: /** @type {string|null} */ (null),
    reconnectAttempt: 0,
    _heartbeatTimer: /** @type {number|null} */ (null),
    _reconnectTimer: /** @type {number|null} */ (null),
    _manuallyClosed: false,

    gameClock: '00:00',
    shotClock: '00',
    gameClockPhase: null,
    period: '1',
    homeScore: 0,  
    awayScore: 0,
    homeFouls: 0,
    awayFouls: 0,
    players: {home:{}, away:{}},
    playersHome: {},
    playersAway: {},
    scoreByPeriodHome: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    scoreByPeriodAway: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    autoGameClock: true,
    autoShotClock: true,
    autoPeriod: true,
    autoScore: true,
    autoFouls: true,
    foulsByPeriodHome: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    foulsByPeriodAway: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    roster: {
      home: [],
      away: []
    }


  }),

  getters: {
    isOpen: (s) => s.status === 'open',
    isConnecting: (s) => s.status === 'connecting'
  },

  actions: {
    setUrl(newUrl) {
      this.url = newUrl
    },

    connect(customUrl) {
      // Si ya estamos abiertos o conectando, no lanzamos otra
      if (this.socket && (this.status === 'open' || this.status === 'connecting')) return

      const url = customUrl || this.url
      this._manuallyClosed = false
      this.lastError = null
      this.status = 'connecting'

      try {
        const ws = this.protocols ? new WebSocket(url, this.protocols) : new WebSocket(url)
        this.socket = ws

        ws.onopen = () => {
          this.status = 'open'
          this.reconnectAttempt = 0
          this._setupHeartbeat()
        }

        ws.onmessage = async (ev) => {
          // Si es Blob, convértelo a texto/arraybuffer antes del parseo seguro
          let payload = ev.data
          if (payload instanceof Blob) {
            // Decodificamos a texto por defecto
            payload = await payload.text()
          }
          
          const parsed = safeParseMessage(payload)
          
          this.lastMessage = parsed.data.data
          
          // Desestructuramos los datos que nos interesan
          if (parsed.data.data.gameClock && this.autoGameClock) { this.gameClock = parsed.data.data.gameClock }
          if (parsed.data.data.shotClock && this.autoShotClock) { this.shotClock = parsed.data.data.shotClock}
          if (parsed.data.data.gameClockPhase)  { this.gameClockPhase = parsed.data.data.gameClockPhase}
          if (parsed.data.data.period && this.autoPeriod) { this.period = parsed.data.data.period }
          if (parsed.data.data.homeScore && this.autoScore) { this.homeScore = parsed.data.data.homeScore }
          if (parsed.data.data.awayScore && this.autoScore) { this.awayScore = parsed.data.data.awayScore }
          if (parsed.data.data.homeFouls && this.autoFouls) { this.homeFouls = parsed.data.data.homeFouls }   
          if (parsed.data.data.awayFouls && this.autoFouls) { this.awayFouls = parsed.data.data.awayFouls }
          // if (parsed.data.data.players.home) { this.playersHome = parsed.data.data.players.home}
          // if (parsed.data.data.players.away) { this.playersAway = parsed.data.data.players.away}
          if(parsed.data.data.players) {
            if(parsed.data.data.players.home.length > 0) {
              const lista = parsed.data.data.players.home
              lista.forEach(jugador => {
                const p = this.roster.home.find(p => p.dorsal === jugador.dorsal) 
                if(p) {
                  console.log(p)
                  if (jugador.points) p.points = jugador.points
                  if( jugador.fouls) p.fouls = jugador.fouls
                }
              })
              // const jugador = this.roster.home.find(p => p["dorsal"] === lista["dorsal"])

              this.playersHome = parsed.data.data.players.home
            }
            if(parsed.data.data.players.away.length > 0) {
              const lista = parsed.data.data.players.away
              lista.forEach(jugador => {
                const p = this.roster.away.find(p => p.dorsal === jugador.dorsal) 
                if(!p) {
                  const points = jugador.points ? jugador.points : 0
                  const fouls = jugador.fouls ? jugador.fouls : 0
                  this.roster.away.push({
                    dorsal: jugador.dorsal,
                    fouls,
                    points
                  })
                }
                if(p) {
                  console.log(p)
                  if (jugador.points) p.points = jugador.points
                  if( jugador.fouls) p.fouls = jugador.fouls
                }
              })
              this.playersAway = parsed.data.data.players.away
            }
            // if (Object.keys(parsed.data.data.players.home).length > 0) {
            //   this.playersHome = parsed.data.data.players.home
            // }
            // if (Object.keys(parsed.data.data.players.away).length > 0) {
            //   this.playersAway = parsed.data.data.players.away
            // }

          }

          if(parsed.data.data.roster) {
            if(parsed.data.data.roster.home.length > 0) {
              const rosterHome = parsed.data.data.roster.home
              rosterHome.forEach(dorsal => { 
                if(!this.roster.home.find(p => p.dorsal === dorsal)) {
                  this.roster.home.push({
                    dorsal,
                    'fouls': 0,
                    'points': 0
                  })
                } 
              })
            }
            if(parsed.data.data.roster.away.length > 0) {
              const rosterAway = parsed.data.data.roster.away 
              rosterAway.forEach(dorsal => { 
                if(!this.roster.away.find(p => p.dorsal === dorsal)) {
                  this.roster.away.push({
                    dorsal,
                    'fouls': 0,
                    'points': 0
                  })
                }
              })
            }
          }
          
          // console.log(this.players)

          this.history.push({ ts: Date.now(), ...parsed })
          if (this.history.length > this.maxHistory) this.history.shift()
        }

        ws.onerror = (e) => {
          // onerror no siempre tiene detalles. Lo registramos y seguimos la fiesta.
          this.lastError = `WebSocket error`
          this.status = 'error'
        }

        ws.onclose = () => {
          this._clearHeartbeat()
          this.socket = null
          this.status = this._manuallyClosed ? 'closed' : 'error'
          if (this.autoReconnect && !this._manuallyClosed) {
            const delay = computeBackoffMs(this.reconnectAttempt++)
            this._scheduleReconnect(delay)
          }
        }
      } catch (err) {
        this.lastError = err?.message || String(err)
        this.status = 'error'
        if (this.autoReconnect && !this._manuallyClosed) {
          const delay = computeBackoffMs(this.reconnectAttempt++)
          this._scheduleReconnect(delay)
        }
      }
    },

    _scheduleReconnect(delayMs) {
      if (this._reconnectTimer) {
        clearTimeout(this._reconnectTimer)
        this._reconnectTimer = null
      }
      this._reconnectTimer = setTimeout(() => {
        this.connect()
      }, delayMs)
    },

    _setupHeartbeat() {
      this._clearHeartbeat()
      if (!this.heartbeatMs || !this.socket) return
      this._heartbeatTimer = setInterval(() => {
        try {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(this.heartbeatPayload)
          }
        } catch {
          // si falla el envío, dejamos que onclose/onerror gestionen la reconexión
        }
      }, this.heartbeatMs)
    },

    _clearHeartbeat() {
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer)
        this._heartbeatTimer = null
      }
    },

    send(data) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket no está abierto')
      }
      const payload = typeof data === 'string' ? data : JSON.stringify(data)
      this.socket.send(payload)
    },

    disconnect() {
      this._manuallyClosed = true
      this._clearHeartbeat()
      if (this._reconnectTimer) {
        clearTimeout(this._reconnectTimer)
        this._reconnectTimer = null
      }
      if (this.socket) {
        this.status = 'closing'
        try {
          this.socket.close(1000, 'Client closing')
        } catch {
          // ignoramos
        } finally {
          this.socket = null
        }
      } else {
        this.status = 'closed'
      }
    },

    clearHistory() {
      this.history = []
    },
    updateScore(equipo, val) {
      if (equipo === 'home') {
        this.homeScore = val;
      } else if (equipo === 'away') {
        this.awayScore = val;
      }
    }
  }
})
