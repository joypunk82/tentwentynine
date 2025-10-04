<script lang="ts">
    import AutumnSky from "$lib/components/AutumnSky.svelte";
</script>

<AutumnSky />

<style>
    @keyframes glow {
        from {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        to {
            text-shadow: 0 0 30px rgba(255, 204, 153, 0.6);
        }
    }
</style>
