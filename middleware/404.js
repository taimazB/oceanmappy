export default function(context) {
  if (context.store.state.domain.includes('oceanmappy'))
    return context.redirect('/404')
}
