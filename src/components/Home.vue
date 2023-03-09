<script lang="ts" setup>
import { ref, computed, Transition } from 'vue'
import type { ComputedRef } from 'vue'
import { useQuoteApi } from '../assets/useQuoteApi.js'
import BarChart from './BarChart.vue'
import PaginationList from './PaginationList.vue'

interface QuotesDataType {
  id: number
  quote: string
  author: string
}

const baseUrl: string = 'https://dummyjson.com/quotes?limit=3'

const url: ComputedRef<string> = computed(() => baseUrl)
const { data, error, retry } = useQuoteApi(url)
const isSortAz = ref<boolean>(false)
const isSortZa = ref<boolean>(false)

const sortByAz = () => {
  data.value.quotes.sort(
    (quote_a: { author: string }, quote_b: { author: string }) =>
      quote_a.author > quote_b.author ? 1 : -1
  )

  if (isSortZa.value) isSortZa.value = !isSortZa.value
  if (!isSortZa.value) isSortAz.value = !isSortAz.value
}

const sortByZa = () => {
  data.value.quotes.sort(
    (quote_a: { author: string }, quote_b: { author: string }) =>
      quote_a.author < quote_b.author ? 1 : -1
  )

  if (isSortAz.value) isSortAz.value = !isSortAz.value
  if (!isSortAz.value) isSortZa.value = !isSortZa.value
}

const deleteQuote = (idx: number) => {
  data.value.quotes = data.value.quotes.filter(
    (el: QuotesDataType) => el.id !== idx
  )
}
</script>

<template>
  <Transition name="fade">
    <header>
      <div class="notif">
        <p>If you see errors, please calm down, it's artificial.</p>
      </div>

      <PaginationList />
      <BarChart />

      <div v-if="error" class="wrapper-error">
        <p>{{ error.message }}</p>
        <button class="btn" @click="retry">Retry</button>
      </div>

      <div v-else-if="data">
        <div v-if="data && data.quotes.length !== 0" class="wrapper-btn">
          <button
            :class="isSortAz ? 'btn-sort-clicked' : ''"
            class="btn"
            @click="sortByAz"
          >
            Sort A-z
          </button>

          <button
            :class="isSortZa ? 'btn-sort-clicked' : ''"
            class="btn"
            @click="sortByZa"
          >
            Sort Z-a
          </button>
        </div>

        <div v-if="data.quotes.length === 0">
          <button class="btn load-btn" @click="retry">Load</button>
        </div>

        <ul>
          <li
            v-for="quote in data.quotes"
            :key="quote.id"
            class="wrapper-quotes"
          >
            <div class="quotes-author">
              {{ quote.author }}
              <button class="quotes-btn" @click="deleteQuote(quote.id)">
                X
              </button>
            </div>
            <div class="quotes-quote">{{ quote.quote }}</div>
          </li>
        </ul>
      </div>

      <h1 v-else class="quotes-loading">Loading quotes...</h1>
    </header>
  </Transition>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

header {
  display: flex;
  place-items: center;
  flex-direction: column;
}

.notif {
  margin-top: -1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: rgba(250, 250, 210, 0.3);
  user-select: none;
  animation-name: notif;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes notif {
  0% {
    opacity: 0.6;
  }
  25% {
    opacity: 1;
    filter: brightness(1.1);
  }
  50% {
    opacity: 0.6;
  }
  75% {
    opacity: 1;
    filter: brightness(1.1);
  }
  100% {
    opacity: 0.6;
  }
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.wrapper-error p {
  color: #f1777d;
  text-align: center;
  margin: 0 2rem;
}

.wrapper-error button {
  margin: 0 4.83rem;
}

.wrapper-btn {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 2rem;
  margin: 0 1rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(31, 31, 31);
  box-shadow: 0px 0px 0.2rem rgb(31, 31, 31);
  color: hsla(160, 75%, 37%, 1);
}

.btn:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(35, 35, 35);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}

.btn:active {
  box-shadow: 0px 0px 0.3rem rgb(35, 35, 35);
  background-color: rgb(35, 35, 35);
  color: rgba(46, 139, 86, 0.79);
}

.btn-sort-clicked {
  background-color: rgb(45, 45, 45);
  box-shadow: 0px 0px 0.2rem rgb(45, 45, 45);
  color: hsla(160, 75%, 27%, 1);
}

.load-btn {
  margin-top: 1rem;
}

.wrapper-quotes {
  background-color: rgb(31, 31, 31);
  text-align: center;
  list-style-type: none;
  color: whitesmoke;
  margin: 1.4rem 6rem 0 6rem;
  padding: 1rem 2rem;
  box-shadow: 0px 0px 0.5rem rgb(35, 35, 35);
  border-radius: 0.2rem;
  border-left: seagreen 0.2rem solid;
}

.quotes-author {
  font-weight: 500;
  text-transform: capitalize;
  font-size: 1rem;
  color: #f1a5a9;
}

.quotes-quote {
  color: #96b5d3;
  font-size: 0.9rem;
}

.quotes-btn {
  font-weight: bold;
  padding: 0.2rem 0.8rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(31, 31, 31);
  color: rgb(220, 44, 44);
}

.quotes-btn:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(35, 35, 35);
  box-shadow: 0px 0px 0.2rem rgb(45, 45, 45);
  cursor: pointer;
  color: rgb(224, 13, 13);
}

.quotes-loading {
  color: whitesmoke;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .wrapper-quotes {
    margin: 1.4rem 1rem 0 1rem;
  }
}
@media (min-width: 1024px) {
  .wrapper-quotes {
    margin: 1.4rem 12rem 0 12rem;
  }
}
</style>