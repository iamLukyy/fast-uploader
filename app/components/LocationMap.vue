<script setup lang="ts">
const props = defineProps<{
  latitude: number
  longitude: number
}>()

const zoom = ref(13)
</script>

<template>
  <LMap
    style="height: 200px; width: 100%;"
    :zoom="zoom"
    :center="[props.latitude, props.longitude]"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a>"
      layer-type="base"
      name="OpenStreetMap"
    />
    <LMarker :lat-lng="[props.latitude, props.longitude]" />
  </LMap>
</template>
