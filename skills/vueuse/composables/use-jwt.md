# useJwt

Wrapper for .

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
import { useJwt } from '@vueuse/integrations/useJwt'
import { defineComponent } from 'vue'

const encodedJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.L8i6g3PfcHlioHCCPURC9pmXT7gdJpx3kOoyAfNUwCc')
const { header, payload } = useJwt(encodedJwt)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| fallbackValue | `Fallback` | null | Value returned when encounter error on decoding |
| onError | `(error: unknown) =&gt; void` | - | Error callback for decoding |

## Returns

| Name | Type |
| --- | --- |
| header | `computed` |
| payload | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useJwt/)
