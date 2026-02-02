# useDateFormat

Get the formatted date according to the string of tokens passed in, inspired by dayjs.

**Package:** `@vueuse/shared`
**Category:** Time

## Usage

```ts
<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'

const formatted = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss')
</script>

<template>
  <div>{{ formatted }}</div>
</template>
```

## Options

| Option         | Type                                                                                        | Default | Description                                                |
| -------------- | ------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| locales        | `MaybeRefOrGetter&lt;Intl.LocalesArgument&gt;`                                              | -       | The locale(s) to used for dd/ddd/dddd/MMM/MMMM format      |
| customMeridiem | `(hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) =&gt; string` | -       | A custom function to re-modify the way to display meridiem |

## Reference

[VueUse Docs](https://vueuse.org/core/useDateFormat/)
