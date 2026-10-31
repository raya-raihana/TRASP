import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const baseURL = process.env.E2ETEST_URL || 'https://9router.chitraparatama.com/v1';
const apiKey = process.env.E2ETEST_API_KEY || '';
const modelName = process.env.E2ETEST_MODEL || 'cx/gpt-6-luna(low)';

const routerProvider = createOpenAICompatible({
  name: 'chitra-router',
  baseURL,
  apiKey,
});

export default {
  tests: 'tests/**/*.e2e.ts',
  targets: [
    {
      engine: web(),
      app: {
        url: 'http://localhost:3000',
        command: {
          executable: process.platform === 'win32' ? 'cmd.exe' : 'npm',
          args: process.platform === 'win32' ? ['/c', 'npm', 'run', 'dev'] : ['run', 'dev'],
          log: '.e2e/logs/app.log',
        },
      },
    },
  ],
  agents: {
    default: {
      model: routerProvider(modelName),
      system: 'You are an expert QA testing agent. Thoroughly verify every interaction and screen outcome.',
    },
  },
  credentials: {
    hero: {
      username: '71261',
      password: () => process.env.E2E_HERO_PASSWORD ?? 'Chitra#71261',
    },
  },
} satisfies E2EConfig;
