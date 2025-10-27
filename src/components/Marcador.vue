<template>
  <v-row>
    {{ status }}
  </v-row>
  <v-card
    color="blue-grey darken-4">
    <v-card-title>
      <v-row>
        <v-col class="d-flex justify-center align-center ga-2">
          <p>CONEXION WEBSOCKET </p>
          <v-icon
           icon="mdi-circle-medium"
           :color="status=== 'open' ? 'green' : 'red'"
           size="small"
           ></v-icon>
        </v-col>

      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row class="ma-0 pa-0">
        <v-col class="pa-0 ma-0 text-center" cols="6">
          <v-row>
            <v-col class="pa-0 ma-0 text-center d-flex justify-center align-center ga-2" >
              <h4>Marcador</h4>
              <v-switch
              class="ma-0 pa-0"
              v-model="autoScore"
              color="red"
              label="Auto"
              hide-details
            ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center">
              <h1>{{ homeScore }} - {{ awayScore }}</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="ma-0 text-center" >
              <p>HOME</p>
              <v-row class="mt-1">
                <v-col cols="12" class="pa-0 ma-0">
                  <v-btn size="x-small" color="green" @click="punto('home', 1)">+1</v-btn>
                  <v-btn size="x-small" color="green" @click="punto('home', 2)">+2</v-btn>
                  <v-btn size="x-small" color="green" @click="punto('home', 3)">+3</v-btn>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-btn size="x-small" color="error" @click="punto('home', -1)">-1</v-btn>
                  <v-btn size="x-small" color="error" @click="punto('home', -2)">-2</v-btn>
                  <v-btn size="x-small" color="error" @click="punto('home', -3)">-3</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" class=" ma-0 text-center" >
              <p>AWAY</p>
              <v-row class="mt-1">
                <v-col cols="12" class="pa-0 ma-0">
                  <v-btn size="x-small" color="green" @click="punto('away', 1)">+1</v-btn>
                  <v-btn size="x-small" color="green" @click="punto('away', 2)">+2</v-btn>
                  <v-btn size="x-small" color="green" @click="punto('away', 3)">+3</v-btn>
                </v-col>
                <v-col cols="12" class="pa-0 ma-0">
                  <v-btn size="x-small" color="error" @click="punto('away', -1)">-1</v-btn>
                  <v-btn size="x-small" color="error" @click="punto('away', -2)">-2</v-btn>
                  <v-btn size="x-small" color="error" @click="punto('away', -3)">-3</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" class="ma-0 text-center" >
              <v-col class="pa-0 ma-0 text-center d-flex justify-center align-center ga-2" >
                <h4>PERIODO {{ period }}</h4>
                <v-switch
                class="ma-0 pa-0"
                v-model="autoPeriod"
                color="red"
                label="Auto"
                hide-details
              ></v-switch>
              </v-col>
              <!-- <p>PERIODO: {{ period }}</p> -->
            </v-col>
            <v-row>
              <!-- <v-col v-for="periodo in periodos" :key="periodo" cols="3" class="pa-0 ma-0 text-center">
                <v-radio-group v-model="period" inline>
                  <v-radio 
                  :value="periodo"
                  color="red"
                  
                  >{{ periodo }}</v-radio>
                </v-radio-group>
              </v-col> -->
              <v-col>
                
                <v-select
                  v-model="periodoTXT"
                  :items="periodos"
                  density="compact"
                ></v-select>
              </v-col>

            </v-row>
          </v-row>

        </v-col>
        <v-col cols="6" class="pa-0 ma-0 text-center">
          <v-row>
            <v-col class="pa-0 ma-0 text-center d-flex justify-center align-center ga-2" >
              <h4>GAME CLOCK</h4>
              <v-switch
                class="ma-0 pa-0"
                v-model="autoGameClock"
                color="red"
                label="Auto"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="pa-0 ma-0 text-center" cols="12">
              <h1>{{ gameClock }}</h1>
            </v-col>
            <v-col>
              <v-btn size="x-small" color="green">START</v-btn>
              <v-btn size="x-small" color="primary">STOP</v-btn>
              <v-btn size="x-small" color="error">RESET</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pa-0 ma-0 text-center d-flex justify-center align-center ga-2" >
              <h4>SHOT CLOCK</h4>
              <v-switch
                class="ma-0 pa-0"
                v-model="autoShotClock"
                color="red"
                label="Auto"
                hide-details
              ></v-switch>
            </v-col>
            <v-col class="pa-0 ma-0 text-center" cols="12">
              <h1>{{ shotClock }}</h1>
            </v-col>
            <v-col>
              <v-btn size="x-small" color="green">START</v-btn>
              <v-btn size="x-small" color="primary">STOP</v-btn>
              <v-btn size="x-small" color="error">RESET 24</v-btn>
              <v-btn size="x-small" color="error">RESET 14</v-btn>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col>
              TANTEO POR CUARTOS
            </v-col>
          </v-row>
          <v-row>
            <v-table density="compact" width="100%">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">1er cuarto</th>
                  <th class="text-left">2o cuarto</th>
                  <th class="text-left">3er cuarto</th>
                  <th class="text-left">4o cuarto</th>
                  <th class="text-left">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(equipo, index) in equipos" :key="equipo"
                >
                <td>{{ equipo }}</td>
                <td>{{ equipo == 'LOCAL' ? scoreByPeriodHome[0] : scoreByPeriodAway[0]}}</td>
                <td>{{ equipo == 'LOCAL' ? scoreByPeriodHome[1] : scoreByPeriodAway[1]}}</td>
                <td>{{ equipo == 'LOCAL' ? scoreByPeriodHome[2] : scoreByPeriodAway[2]}}</td>
                <td>{{ equipo == 'LOCAL' ? scoreByPeriodHome[3] : scoreByPeriodAway[3]}}</td>
                <td>{{ equipo == 'LOCAL' ? homeScore : awayScore }}</td>
                </tr>
              </tbody>

            </v-table>
          </v-row>
          <v-row>
            <v-col>
              FALTAS POR CUARTOS
            </v-col>
          </v-row>
          <v-row>
            <v-table density="compact" width="100%">
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">1er cuarto</th>
                  <th class="text-left">2o cuarto</th>
                  <th class="text-left">3er cuarto</th>
                  <th class="text-left">4o cuarto</th>
                  <th class="text-left">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(equipo, index) in equipos" :key="equipo"
                >
                <td>{{ equipo }}</td>
                <td>{{ equipo == 'LOCAL' ? foulsByPeriodHome[0] : foulsByPeriodAway[0]}}</td>
                <td>{{ equipo == 'LOCAL' ? foulsByPeriodHome[1] : foulsByPeriodAway[1]}}</td>
                <td>{{ equipo == 'LOCAL' ? foulsByPeriodHome[2] : foulsByPeriodAway[2]}}</td>
                <td>{{ equipo == 'LOCAL' ? foulsByPeriodHome[3] : foulsByPeriodAway[3]}}</td>
                <td>{{ equipo == 'LOCAL' ? homeFouls : awayFouls }}</td>
                </tr>
              </tbody>

            </v-table>
          </v-row>

        </v-col>
        
        <v-col cols="6">

          <v-row>
            <v-col class="pa-0 ma-0 text-center d-flex justify-center align-center ga-2" >
              <h4>FALTAS</h4>
              <v-switch
              class="ma-0 pa-0"
              v-model="autoFouls"
              color="red"
              label="Auto"
              hide-details
            ></v-switch>
            </v-col>
            
          </v-row>
          <v-row>
            <v-col class="text-center" cols="6" v-for="equipo in equipos" :key="equipo">
              <h4>{{ equipo }} - {{ equipo == 'LOCAL' ? foulsByPeriodHome[period -1] : foulsByPeriodAway[period -1] }}</h4>
              <v-row>
                <v-col>
                  <v-btn
                  @click="setFaltas(`RESET_${equipo}`, 0)"
                  size="x-small"
                  color="error"
                  >RESET</v-btn>
                  <span v-for="val in 5" :key="val">
                    <v-btn
                      size="x-small"
                      :color="getColorFaltas(equipo, val )"
                    >{{ val  }}</v-btn>

                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn size="x-small" @click="setFaltas(equipo, 1)" color="success">+</v-btn>
                  <v-btn size="x-small" @click="setFaltas(equipo, -1)" color="error">-</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ roster }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ playersHome }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          {{ playersAway }}
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col>{{ scoreByPeriodHome }}</v-col>
        <v-col>{{ scoreByPeriodAway }}</v-col>
      </v-row> -->
      <!-- <div class="text-center">
        <h3>Periodo: {{ period }}</h3>
        <h3>Reloj de juego: {{ gameClock }}</h3>
        <h3>Reloj de tiro: {{ shotClock }}</h3>
        <h3>Faltas Local: {{ homeFouls }} - Faltas Visitante: {{ awayFouls }}</h3>
        <h3>Fase del reloj de juego: {{ gameClockPhase }}</h3>
      </div> -->
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { useWsDataStore } from '@/stores/wsData'
  import { usevMixStore } from '@/stores/vMix';
  import { storeToRefs } from 'pinia';
  import { computed, ref, watch } from 'vue';

  const wsDataStore = useWsDataStore()
  const vMixStore = usevMixStore()

  const equipos = ref(['LOCAL', 'VISITANTE'])

  const { lastMessage, gameClock, shotClock, gameClockPhase, period, homeScore, awayScore, homeFouls, awayFouls, scoreByPeriodHome, scoreByPeriodAway,
    autoFouls, autoGameClock, autoPeriod, autoScore, autoShotClock, foulsByPeriodAway, foulsByPeriodHome, 
    playersHome, playersAway, roster } = storeToRefs(wsDataStore)

  const { status } = storeToRefs(wsDataStore) 

  const periodos = ['1', '2', '3', '4', 'OT', '2OT', '3OT', '4OT', '5OT']
  const periodoTXT = ref('1')



  const getColorFaltas = (team, val) => {
    let color = 'primary'
    if(val == 5) { color = 'error' }
    if(val == 0) { color = 'success' }
    if (team === 'LOCAL') {
      // return (val <= homeFouls.value) ? color : 'grey'
      return (val <= foulsByPeriodHome.value[period.value -1]) ? color : 'grey'
    } else if (team === 'VISITANTE') {
      // return (val <= awayFouls.value) ? color : 'grey'
      return (val <= foulsByPeriodAway.value[period.value -1]) ? color : 'grey'
    }
    return 'grey'
  }

  const setFaltas = (team, val) => {
    
    if(team === 'RESET_LOCAL') {
      homeFouls.value -= foulsByPeriodHome.value[period.value -1]
      resetFaltasVisual('LOC')
      
      return
    }
    if(team === 'RESET_VISITANTE') {
      awayFouls.value -= foulsByPeriodAway.value[period.value -1]
      resetFaltasVisual('VIS')
      return
    }
    
    if (team === 'LOCAL') {
      homeFouls.value  += val
      foulsByPeriodHome.value[period.value -1] += val
    } else if (team === 'VISITANTE') {
      awayFouls.value += val
      foulsByPeriodAway.value[period.value -1] += val
    }
  }

  const resetFaltasVisual = equipo => {
    for(let i = 1; i <= 5; i++) {
      vMixStore.setImageVisible('MARCADOR', `FALTA_${equipo}_${i}`, false)
    }
  }
  
  const punto = (team, points) => {
    if (team === 'home') {
      const score = parseInt(homeScore.value) + points
      wsDataStore.updateScore('home', score)
    } else if (team === 'away') {
      const score = parseInt(awayScore.value) + points
      wsDataStore.updateScore('away', score)
    }
  }


  watch(() => homeScore.value, (newVal, oldVal) => {
    // Calcular el valor de la canasta y actualizar el array scoreByPeriodHome
    const canasta = parseInt(newVal) - parseInt(oldVal)
    scoreByPeriodHome.value[period.value - 1] += canasta

    // Enviar la actualización a vMix
    let nombre = 'MARCADOR'
    let capa = 'PUNTUACION LOCA'
    vMixStore.liveUpdate(nombre, capa, newVal)
    
    nombre = '2 RESULTADO CUARTOS TERCIO INFERIOR.gtzip'
    capa = 'puntos local'
    vMixStore.liveUpdate(nombre, capa, newVal)

    // Enviar marcador parcial
    nombre = 'MARCADOR_POR_CUARTOS'
    for (let i = 0; i <= 3; i++) {
      capa = `${i+1}Q LOCAL`
      vMixStore.liveUpdate(nombre, capa, scoreByPeriodHome.value[i])
      capa = `${i+1}Q VISITANTE`
      vMixStore.liveUpdate(nombre, capa, scoreByPeriodAway.value[i])
    }
    vMixStore.liveUpdate(nombre, 'SUMA LOCAL', homeScore.value)
    vMixStore.liveUpdate(nombre, 'SUMA VISITANTE', awayScore.value)

    // RESULTADO AL FINAL DEL CUARTO
    nombre = 'resultados cuartos.gtzip'
    capa = 'Puntacion local'
    vMixStore.liveUpdate(nombre, capa, newVal)
  })
  watch(() => awayScore.value, (newVal, oldVal) => {
    // Calcular el valor de la canasta y actualizar el array scoreByPeriodHome
    const canasta = parseInt(newVal) - parseInt(oldVal)
    scoreByPeriodAway.value[period.value - 1] += canasta
    // Enviar la actualización a vMix
    // MARCADOR PRINCIPAL
    let nombre = 'MARCADOR'
    let capa = 'PUNTUACION VISI'

    vMixStore.liveUpdate(nombre, capa, newVal)

    // PARCIALES POR CUARTOS ENTEROS
    nombre = '2 RESULTADO CUARTOS TERCIO INFERIOR.gtzip'
    capa = 'puntos visitant'
    vMixStore.liveUpdate(nombre, capa, newVal)

    // Enviar marcador parcial
    nombre = 'MARCADOR_POR_CUARTOS'
    for (let i = 0; i <= 3; i++) {
      capa = `${i+1}Q LOCAL`
      vMixStore.liveUpdate(nombre, capa, scoreByPeriodHome.value[i])
      capa = `${i+1}Q VISITANTE`
      vMixStore.liveUpdate(nombre, capa, scoreByPeriodAway.value[i])
    }
    vMixStore.liveUpdate(nombre, 'SUMA LOCAL', homeScore.value)
    vMixStore.liveUpdate(nombre, 'SUMA VISITANTE', awayScore.value)

    // RESULTADO AL FINAL DEL CUARTO
    nombre = 'resultados cuartos.gtzip'
    capa = 'puntuacion visi'
    vMixStore.liveUpdate(nombre, capa, newVal)


  })

  watch(() => homeFouls.value, (newVal) => {
    const numPeriodo = period.value -1 

    let previousFouls = 0
    for(let i = 0; i < numPeriodo; i++) {
      previousFouls += foulsByPeriodHome.value[i]

    }
    const faltasEnEsteCuarto = parseInt(newVal) - previousFouls

    foulsByPeriodHome.value[numPeriodo] = faltasEnEsteCuarto
    // console.log(faltasEnEsteCuarto)



    for(let i = faltasEnEsteCuarto; i <= 5; i++) {
      vMixStore.setImageVisible('MARCADOR', `FALTA_LOC_${i}`, false)
    }
    for(let i = 1; i <= faltasEnEsteCuarto; i++) {
      vMixStore.setImageVisible('MARCADOR', `FALTA_LOC_${i}`, true)
    }
  })
  watch(() => awayFouls.value, (newVal) => {
    const numPeriodo = period.value -1 

    let previousFouls = 0
    for(let i = 0; i < numPeriodo; i++) {
      previousFouls += foulsByPeriodAway.value[i]
    }

    const faltasEnEsteCuarto = parseInt(newVal) - previousFouls
    foulsByPeriodAway.value[numPeriodo] = faltasEnEsteCuarto
    for(let i = faltasEnEsteCuarto + 1; i <= 5; i++) {
      vMixStore.setImageVisible('MARCADOR', `FALTA_VIS_${i}`, false)
    }
    for(let i = 1; i <= faltasEnEsteCuarto; i++) {
      vMixStore.setImageVisible('MARCADOR', `FALTA_VIS_${i}`, true)
    }
  })

  watch(() => periodoTXT.value, (newVal) => {
    period.value = periodos.indexOf(newVal) + 1
    resetFaltasVisual('LOC')
    resetFaltasVisual('VIS')
  })


  
  watch(() => period.value, (newVal, oldVal) => {
    let nombre = 'MARCADOR'
    let capa = 'CUARTO'
    
    vMixStore.liveUpdate(nombre, capa, newVal + 'º')

    nombre = '2 RESULTADO CUARTOS TERCIO INFERIOR.gtzip'
    capa = 'Cuarto'
    
    vMixStore.liveUpdate(nombre, capa, newVal + 'º Cuarto')
    
    // RESULTADO AL FINAL DEL CUARTO
    nombre = 'resultados cuartos.gtzip'
    capa = 'cuarto'
    vMixStore.liveUpdate(nombre, capa, newVal + 'º CUARTO FINAL')
    
    
    // // Enviar marcador parcial
    // nombre = 'MARCADOR_POR_CUARTOS'
    // for (let i = 0; i <= 3; i++) {
      //   capa = `${i+1}Q LOCAL`
      //   vMixStore.liveUpdate(nombre, capa, scoreByPeriodHome.value[i])
      //   capa = `${i+1}Q VISITANTE`
      //   vMixStore.liveUpdate(nombre, capa, scoreByPeriodAway.value[i])
      // }
      // vMixStore.liveUpdate(nombre, 'SUMA LOCAL', homeScore.value)
      // vMixStore.liveUpdate(nombre, 'SUMA VISITANTE', awayScore.value)
      
    })
    
    
    
    watch(() => shotClock.value, (newVal) => {
      const nombre = 'MARCADOR'
      const capa = 'POSESION'
      
      vMixStore.liveUpdatePosesion(nombre, capa, newVal)
    })
    
    watch(() => gameClock.value, (newVal) => {
      const nombre = 'MARCADOR'
      const capa = 'CRONO'
  
      vMixStore.liveUpdateCrono(nombre, capa, newVal)
    })

    // watch(() => playersHome.value, newVal => {
    //   console.log(newVal)
    // })
    // watch(() => playersAway.value, newVal => {
    //   console.log(newVal)
    // })
</script>


<style lang="scss" scoped>

</style>