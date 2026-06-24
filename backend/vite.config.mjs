import { defineConfig } from 'vitest/config'

export default defineConfig({
    test:{
        dir: 'src',
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    dir: 'src/services',
                },
            },
            {
                extends: true,
                test: {
                    name: 'e2e',
                    dir: 'src/controllers'
                }
            }
        ]
    }
})