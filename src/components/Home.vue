<template>
    <div class="flex flex-col sm:flex-row w-full h-[46vw]">
      <Filters class="w-full sm:w-1/3 md:w-2/10" />
      <List class="mt-2 w-full sm:w-2/3 md:w-10/12" />
    </div>
  </template>

<script setup lang="ts">
import Filters from './Filters.vue';
import List from './List.vue';
</script>

<!-- <div class="flex w-full  " >
    <Filters class="w-100" />
    <List class="mt-2 w-full"/>
   
</div> -->