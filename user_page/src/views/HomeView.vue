<template>
  <div class="col user-page">
    <div class="col user-page-content">
      <div class="col user-box">
        <div class="row user-profile">
          <div class="col user-profile-pic-and-name">
            <img src="../assets/default.png" alt="User profile picture" class="user-profile-pic">
            <div class="row user-name-and-status">
              <div class="connect"></div>
              <p class="user-name text">{{ userName }}</p>
            </div>
          </div>
          <div class="col user-description">
            <p class="text">text</p>
          </div>
        </div>
      </div>
      <div class="row button-zone">
        <button class="ft-button block-button">BLOCK USER</button>
        <button class="ft-button add-button">ADD FRIEND</button>
      </div>
      <div class="row user-box user-stats">
        <div class="col user-stat">
          <h1 class="text">Game(s) played</h1>
          <p class="text user-score fade-text">{{ userGamesPlayed }}</p>
        </div>
        <div class="col user-stat">
          <h1 class="text">Win rate</h1>
          <radial-progress-bar :diameter="200" :completed-steps="userWins" :total-steps="userGamesPlayed"
            :startColor="'#66fcf1'" :stopColor="'#45a29e'" :innerStrokeColor="'#e82e50'" :innerStrokeWidth="15"
            :strokeWidth="15" :strokeLinecap="'line'">
            <p class="text user-win-rate">{{ userWinRate }}%</p>
          </radial-progress-bar>
        </div>
        <div class="col user-stat">
          <h1 class="text">Win(s)</h1>
          <p class="text user-score fade-text">{{ userWins }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

// @ts-ignore
import RadialProgressBar from 'vue-radial-progress';

export default defineComponent({
  name: 'HomeView',
  components: { RadialProgressBar },
  setup() {
    const userName = ref("username");
    const userDescription = ref("userdescription");
    const userGamesPlayed = ref(23);
    const userWins = ref(12);
    const userWinRate = computed(() => {
      return Math.round(userWins.value / userGamesPlayed.value * 100);
    })

    return { userName, userDescription, userGamesPlayed, userWins, userWinRate };
  }
});
</script>

<style src="../../../pages_union/src/assets/global.css" rel="stylesheet" lang="css"></style>
<style>
/* Page structure */
p {
  margin: 0;
}

html {
  background: linear-gradient(45deg, var(--pblack), var(--pdark));
}

.text {
  color: white;
}

.user-page {
  min-width: 450px;
  align-items: center;

  padding: 3em;
}

.user-page-content {
  max-width: 960px;
}

/* Columns and rows */
.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
}

/* User profile */
.user-box {
  box-shadow: var(--pcyan) 0px 0px 0px 2px, var(--pblue) 0px 4px 6px -1px, var(--pblue) 0px 1px 0px inset;
  background: var(--pdark);
  width: 100%;
}

.user-profile-pic-and-name {
  align-items: center;
  width: 40%;
  border-right: 1px solid var(--plight);
}

.user-profile-pic {
  margin: 1em 0;
  width: 70%;
}

.user-name-and-status {
  margin: .2em 0 1em 0;
  align-items: center;
}

.connect {
  border-radius: 50%;
  width: 1em;
  height: 1em;
  background: lime;
  margin-right: .5em;
  margin-top: 2%;
}

.user-name {
  font-size: 2em;
}

.user-description {
  padding: 2%;
}

/* Buttons */
.button-zone {
  width: 40%;
  justify-content: space-around;

  margin-top: 1em;
  margin-bottom: 4em;
}

.add-button {
  background: rgba(0, 255, 0, 0.875);
  box-shadow: 0 4px 0 green;
}

.add-button:hover {
  background: lime;
}

.block-button {
  background: rgb(251, 80, 80, 0.875);
  box-shadow: 0 4px 0 red;
}

.block-button:hover {
  background: rgb(251, 80, 80);
}

.user-page-button:hover {
  cursor: pointer;
}

/* Stats */
.user-stats {
  justify-content: center;
}

.user-stat {
  width: 33%;
  align-items: center;
  padding-bottom: 1.5em;
}


.user-score {
  font-size: 9em;
  padding-top: .1em;
}

.user-win-rate {
  font-size: 2.5em;
}

/* Media queries */

@media (max-width: 1000px) {
  .row {
    flex-direction: column;
  }

  .user-stat {
    border-top: 2px solid var(--plight);
    width: 100%;
  }

  .button-zone {
    width: 100%;
  }

  .button-zone,
  .user-profile,
  .user-name-and-status {
    flex-direction: row;
  }
}

@media (max-width: 850px) {
  .user-profile {
    flex-direction: column;
  }

  .user-profile-pic-and-name {
    width: 100%;
    border: none;
    border-bottom: 1px solid var(--plight);
  }

  .user-profile-pic {
    width: 30%;
  }
}
</style>
