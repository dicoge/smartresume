<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { contact } from '../../data/contact'
import { useScrollReveal } from '../../composables/useScrollReveal'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
useScrollReveal(sectionRef)

// Set VITE_FORMSPREE_ID in .env.local to enable the contact form.
// Get a free form ID at https://formspree.io (no backend needed).
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_ID
const FORMSPREE_ENDPOINT = FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${FORMSPREE_FORM_ID}`
  : ''

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  _gotcha: string
}

const form = reactive<FormData>({
  name: '',
  email: '',
  subject: 'inquiry',
  message: '',
  _gotcha: '',
})

interface FormErrors {
  name: string
  email: string
  message: string
}

const errors = reactive<FormErrors>({
  name: '',
  email: '',
  message: '',
})

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = t('contact.errorNameRequired')
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = t('contact.errorEmailRequired')
    valid = false
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = t('contact.errorEmailInvalid')
    valid = false
  }

  if (!form.message.trim()) {
    errors.message = t('contact.errorMessageRequired')
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  // Honeypot check — if filled, silently reject
  if (form._gotcha) return

  if (!FORMSPREE_ENDPOINT) {
    // Formspree not configured — show a helpful message
    status.value = 'error'
    setTimeout(() => (status.value = 'idle'), 4000)
    return
  }

  status.value = 'sending'
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      }),
    })
    if (res.ok) {
      status.value = 'success'
      form.name = ''
      form.email = ''
      form.subject = 'inquiry'
      form.message = ''
      form._gotcha = ''
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
  setTimeout(() => (status.value = 'idle'), 5000)
}
</script>

<template>
  <section ref="sectionRef" id="contact" class="py-20" style="background-color: var(--bg-primary);">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('contact.title') }}</h2>
      <p class="section-subtitle">{{ t('contact.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- Contact Info -->
        <div class="p-8 rounded-2xl" style="background-color: var(--bg-secondary); border: 1px solid var(--border);">
          <h3 class="font-semibold text-lg mb-6" style="color: var(--accent);">{{ t('contact.infoTitle') }}</h3>

          <div class="space-y-6">
            <div class="flex items-center gap-4" style="color: var(--text-secondary);">
              <span class="text-2xl">🐙</span>
              <div>
                <div class="font-medium" style="color: var(--text-primary);">{{ t('contact.github') }}</div>
                <a :href="contact.github.url" target="_blank" rel="noopener noreferrer" style="color: var(--accent);" class="hover:opacity-80">
                  {{ contact.github.handle }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-4" style="color: var(--text-secondary);">
              <span class="text-2xl">📧</span>
              <div>
                <div class="font-medium" style="color: var(--text-primary);">{{ t('contact.email') }}</div>
                <a :href="`mailto:${contact.email.address}`" style="color: var(--accent);" class="hover:opacity-80">
                  {{ contact.email.address }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-4" style="color: var(--text-secondary);">
              <span class="text-2xl">📍</span>
              <div>
                <div class="font-medium" style="color: var(--text-primary);">{{ t('contact.location') }}</div>
                <span>{{ contact.location }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t" style="border-color: var(--border);">
            <p class="text-sm mb-2" style="color: var(--text-secondary);">{{ t('contact.interests') }}</p>
            <ul class="text-sm space-y-1" style="color: var(--text-secondary);">
              <li>• {{ t('contact.interest1') }}</li>
              <li>• {{ t('contact.interest2') }}</li>
              <li>• {{ t('contact.interest3') }}</li>
              <li>• {{ t('contact.interest4') }}</li>
            </ul>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="p-8 rounded-2xl" style="background-color: var(--bg-secondary); border: 1px solid var(--border);">
          <h3 class="font-semibold text-lg mb-6" style="color: var(--accent);">{{ t('contact.formTitle') }}</h3>

          <!-- Success message -->
          <div v-if="status === 'success'" class="mb-4 p-4 rounded-lg text-sm" style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80;">
            ✅ {{ t('contact.successMessage') }}
          </div>

          <!-- Error message -->
          <div v-else-if="status === 'error'" class="mb-4 p-4 rounded-lg text-sm" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171;">
            ⚠️ {{ t('contact.errorMessage') }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Honeypot field — hidden from real users, catches bots -->
            <div style="position: absolute; left: -9999px" aria-hidden="true">
              <label for="_gotcha">Don't fill this field</label>
              <input id="_gotcha" v-model="form._gotcha" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">{{ t('contact.nameLabel') }} *</label>
              <input
                v-model="form.name"
                type="text"
                :placeholder="t('contact.namePlaceholder')"
                class="dark-input w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors"
                :style="{ borderColor: errors.name ? '#ef4444' : 'var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
              />
              <p v-if="errors.name" class="mt-1 text-xs" style="color: #ef4444;">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">{{ t('contact.emailLabel') }} *</label>
              <input
                v-model="form.email"
                type="email"
                :placeholder="t('contact.emailPlaceholder')"
                class="dark-input w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors"
                :style="{ borderColor: errors.email ? '#ef4444' : 'var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
              />
              <p v-if="errors.email" class="mt-1 text-xs" style="color: #ef4444;">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">{{ t('contact.subjectLabel') }}</label>
              <select
                v-model="form.subject"
                class="dark-input w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors"
                style="border-color: var(--border); background-color: var(--bg-secondary); color: var(--text-primary);"
              >
                <option value="inquiry">{{ t('contact.subjectOptions.inquiry') }}</option>
                <option value="collaboration">{{ t('contact.subjectOptions.collaboration') }}</option>
                <option value="question">{{ t('contact.subjectOptions.question') }}</option>
                <option value="other">{{ t('contact.subjectOptions.other') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm mb-1" style="color: var(--text-secondary);">{{ t('contact.messageLabel') }} *</label>
              <textarea
                v-model="form.message"
                :placeholder="t('contact.messagePlaceholder')"
                rows="4"
                class="dark-input w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors resize-y"
                :style="{ borderColor: errors.message ? '#ef4444' : 'var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }"
              />
              <p v-if="errors.message" class="mt-1 text-xs" style="color: #ef4444;">{{ errors.message }}</p>
            </div>

            <button
              type="submit"
              :disabled="status === 'sending'"
              class="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="status === 'sending'">{{ t('contact.sending') }}...</span>
              <span v-else>{{ t('contact.send') }} →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>