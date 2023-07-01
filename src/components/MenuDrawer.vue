<script setup lang="ts">
import router from '../router/index';
import { ref } from 'vue';

const showMenu = ref(false);
function toggleMenu() {
    showMenu.value = !showMenu.value;
}
</script>

<template>
    <div class="fixed z-50 drop-shadow-xl">
        <button class="p-1" @click="toggleMenu"><img src="../assets/menu.svg" alt="Menu" /></button>
        <ul v-if="showMenu" class="px-8 py-4 bg-white max-w-md">
            <li class="mb-4" v-for="route in router.getRoutes()" v-bind:key="route.path">
                <a :href="route.path" class="text-blue-600 underline underline-offset-4">{{ route.name }}</a>
            </li>
        </ul>
    </div>

</template>