<template>
  <div
    class="h-screen bg-gray-800 text-white text-2xl uppercase whitespace-nowrap flex flex-col text-center justify-center">
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/api/constants';
import useSession from '@/composables/session';
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

type LoginStatus = 'pending' | 'loggedIn' | 'loggedOut';

const router = useRouter();
const route = useRoute();
const { setToken, setExpiration } = useSession();

const loginStatus = ref<LoginStatus>('loggedOut');
const text = computed(() => {
  switch (loginStatus.value) {
    case 'loggedIn': return 'Success!'
    case 'loggedOut':
    default: return 'Logging in...'
  }
});

const override = ref(false);

function loggedIn(sessionToken: string, sessionExpiration: number) {
  setToken(sessionToken);
  setExpiration(sessionExpiration);
  loginStatus.value = 'loggedIn'

  setTimeout(() => router.push('/app'), 1500);
}

function ynabLogin() {
  const url = `${apiUrl}/auth/ynab/login`;
  loginStatus.value = 'pending';
  location.replace(url);
}

onMounted(async () => {
  const { sessionToken, sessionExpiration } = route.query;
  if (typeof sessionToken === 'string' && typeof sessionExpiration === 'string') {
    override.value = true;
    loggedIn(sessionToken, parseInt(sessionExpiration));
  } else {
    setTimeout(ynabLogin, 1000);
  }
});

</script>
