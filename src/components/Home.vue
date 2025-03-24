<template>
    <div class="flex w-full h-[44vw] " >
        <Filters class="w-100" />
        <List class="mt-2 w-full"/>
        <p class="text-gray-700 text-sm absolute">Última atualização 24/03/2025</p>
    </div>
</template>

<script setup lang="ts">
import Filters from './Filters.vue';
import List from './List.vue';
</script>