<template>
    <div class="navbar-container">
        <NuxtLink class="navbar-title" to="/">
            <div >
                TCG Proxy Master
            </div>
        </NuxtLink>
        <div class="navbar-link-container">
            <NuxtLink to="/">
                Home
            </NuxtLink>
            <NuxtLink to="/games/altered">
                Altered
            </NuxtLink>
            <NuxtLink to="/games/lorcana">
                Lorcana
            </NuxtLink>
            <NuxtLink to="/games/pokemon">
                Pokemon
            </NuxtLink>
        </div>
    </div>
</template>
<style lang="scss">
@import '../style/color.scss';

.navbar-container {
    background-color: black;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid $tertiary;
    .navbar-title{
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        text-decoration: none;
        color: inherit;
    }
    .navbar-link-container{
        width: 30%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        a{
            text-decoration: none;
            color: inherit;
            &:hover{
                color: $tertiary;
                text-decoration: underline;
            }
        }
    }
}
</style>