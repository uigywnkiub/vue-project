import { ref } from '@vue/reactivity'
import type { Ref } from '@vue/reactivity'
import axios from 'axios'

import { usePagination } from './useClientSidePagination'

const URL: string = 'https://jsonplaceholder.typicode.com/posts'

export interface Post {
  id: number
  title: string
  body: string
}

export function usePostsApi(
  currentPage: Ref<number>,
  rowsPerPage?: Ref<number>
) {
  const posts: Ref<Post[]> = ref([])
  const isError = ref<boolean | null>(null)
  const isRetryLoadPosts = ref<boolean>(false)
  const { paginatedArray, numberOfPages } = usePagination<Post>({
    rowsPerPage,
    arrayToPaginate: posts,
    currentPage,
  })

  const loadPosts = async () => {
    isError.value = false

    try {
      // artificial delay and random error
      await timeout()
      const res = await axios.get(URL)
      posts.value = res.data.slice(0, 15)
    } catch (e: any) {
      isError.value = true
      // throw new Error(e)
    }
  }

  const retryWithDelay = () => {
    isRetryLoadPosts.value = true

    setTimeout(() => {
      isRetryLoadPosts.value = false
      loadPosts()
    }, 2900)
  }

  return {
    posts: paginatedArray,
    loadPosts,
    retryWithDelay,
    isRetryLoadPosts,
    isError,
    numberOfPages,
  }
}

// artificial delay
function timeout() {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(
          new Error('Oops! Error encountered. Cannot load the pagination list.')
        )
      }
    }, 300)
  })
}
