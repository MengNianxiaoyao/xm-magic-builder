<script setup lang="ts">
defineProps<{ label?: string }>();
</script>

<template>
    <div class="input-group">
        <span v-if="label" class="label">{{ label }}</span>
        <slot />
    </div>
</template>
