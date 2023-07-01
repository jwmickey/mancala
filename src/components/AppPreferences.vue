<script setup lang="ts">
import { ref } from 'vue';
import { loadPreferences, savePreferences } from '../preferences';
import { type AppSettings, DELAY_DEFAULT, DELAY_MAX, DELAY_MIN } from '@/consts'

const settings = ref<AppSettings>(loadPreferences());

</script>

<template>
    <div class="p-10">
        <form v-on:change="savePreferences(settings)">
            <div>
                <label for="delay">Placement Speed</label>
                <input id="delay" name="delay" v-model="settings.delay"
                    type="number" :v-min="DELAY_MIN" :v-max=DELAY_MAX step="100"
                    @change="() => settings.delay = Math.min(DELAY_MAX, Math.max(DELAY_MIN, settings.delay || DELAY_DEFAULT)) "
                    class="outline outline-blue-500 rounded-md px-2 py-1 m-2 text-lg font-mono">
                <p class="text-sm">
                    The number of milliseconds between placing each stone.  
                    Must be a number between {{ DELAY_MIN }} and {{ DELAY_MAX }}
                </p>
            </div>
        </form>
    </div>
</template>