export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/") {
    return navigateTo("/components", { redirectCode: 301 });
  }
});
