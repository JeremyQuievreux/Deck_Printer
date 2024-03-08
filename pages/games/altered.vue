<template>
    <div class="altered-page-container">
        <div class="main-container">
            <div class="cards-container">
                <div v-for="(card, index) in cards" :key="index" class="card-container">
                    <img :src="card.pic_url" alt="">
                    <button >Add</button>
                </div>
            </div>
            <div class="deck-container">

            </div>
        </div>
    </div>
</template>
<script>
import { cards } from '../data/cards';

export default {
    data() {
        return {
            cards: [...cards]
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/color.scss";
.altered-page-container {
    .main-container{
        display: flex;
        justify-content: space-around;
        padding-top: 20px;
        .cards-container{
            border: 2px solid $tertiary;
            width: 70%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            .card-container{
                display: flex;
                flex-direction: column;
                max-width: 250px;
                justify-content: center;
                align-items: center;
                margin: 10px;
                img{
                    width: 100%;
                    border-radius: 15px;
                    margin-bottom: 10px;
                }
                button{
                    margin: 10px;
                }
                &:hover{
                    scale: 125%;
                }
            }
        }
        .deck-container{
            border: 2px solid $tertiary;
            width: 25%;
        }
    }
}
</style>