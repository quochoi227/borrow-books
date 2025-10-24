<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
    router.push('/')
}
</script>
<template>
    <div class="flex flex-col items-center justify-center h-[80vh] text-center">
		<h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
		<p class="text-lg text-gray-500 mb-6">The page you are looking for does not exist.</p>
		<button
			class="btn btn-primary btn-outline"
			@click="goHome"
		>
			Go Home
		</button>
	</div>
</template>