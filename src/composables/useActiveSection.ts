import { ref } from 'vue'
export const activeSceneId = ref('home')
/** Shared with the scene scroll controller, including long sections. */
export function useActiveSection() { return { activeSection: activeSceneId } }
