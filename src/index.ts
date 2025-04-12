export default {
  async fetch(req) {
    return new Response('OwO')
  },

  async scheduled(event, env, ctx): Promise<void> {
    const time = Math.round(event.scheduledTime / 60 / 15) * 60 * 15
    console.log(time)
  },
} satisfies ExportedHandler<Env>
