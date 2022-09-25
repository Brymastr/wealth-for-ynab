<template>
  <div class="h-screen">
    <LoginButton :override="override" />
  </div>
</template>

<script lang="ts">
import LoginButton from '@/components/General/LoginButton.vue';
import useSession from '@/composables/session';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: { LoginButton },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { setToken, setExpiration } = useSession();

    const override = ref(false);

    function loggedIn(sessionToken: string, sessionExpiration: number) {
      setToken(sessionToken);
      setExpiration(sessionExpiration);

      setTimeout(() => router.push('/app'), 1500);
    }

    onMounted(async () => {
      const { sessionToken, sessionExpiration } = route.query;
      if (typeof sessionToken === 'string' && typeof sessionExpiration === 'string') {
        override.value = true;
        loggedIn(sessionToken, parseInt(sessionExpiration));
      }
    });

    return { override };
  },
});
</script>
