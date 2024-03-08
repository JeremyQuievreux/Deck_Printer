<template>
    <div class="lorcana-page-container">
        <div class="filter-bar-container">
            <div class="set-filter-select">
                <label for="set-filter">Choisir le set : </label>
                <select name="set-filter" id="set-filter" v-model="selectedSet" @change="onFilterChange">
                    <option value="all">...</option>
                    <option v-for="(set, index) in lorcanaSetsEnumeration" :key="index" :value="set.value">{{ set.label }}</option>
                </select>
            </div>
            <div class="color-filter-select">
                <label for="color-filter">Choisir le set : </label>
                <select name="color-filter" id="color-filter" v-model="selectedColor" @change="onFilterChange">
                    <option value="all">...</option>
                    <option v-for="(color, index) in lorcanaColorsEnumeration" :key="index" :value="color.value">{{ color.label }}</option>
                </select>
            </div>
        </div>
        <div class="main-container">
            <div class="cards-container">
                <div v-for="(card, index) in filteredCards" :key="index" class="card-container">
                    <img :src="card.image" alt="">
                    <button>Add</button>
                </div>
            </div>
            <div class="deck-container">

            </div>
        </div>
    </div>
</template>
<script>
import { lorcanaAllCards } from '../data/lorcana/lorcanaAllCards';
import { lorcanaSetsEnumeration } from '../data/enumeration';
import { lorcanaColorsEnumeration } from '../data/enumeration';

export default {
    data() {
        return {
            filteredCards: [],
            lorcanaSetsEnumeration: lorcanaSetsEnumeration,
            lorcanaColorsEnumeration: lorcanaColorsEnumeration,
            selectedSet: "all",
            selectedColor: "all"
        }
    },
    created() {
        this.filteredCards = lorcanaAllCards;
    },
    methods: {
        filterCardsBySet(cardsToFilter, setFilter){
            if (setFilter == "all") {
                return cardsToFilter
            } else {
                return cardsToFilter.filter((card) => card.set == setFilter)
            }
        },
        filterCardsByColor(cardsToFilter, colorFilter){
            if (colorFilter == "all") {
                return cardsToFilter
            } else {
                return cardsToFilter.filter((card) => card.color == colorFilter)
            }
        },
        onFilterChange(){
            let cardsFilteredBySet = this.filterCardsBySet(lorcanaAllCards, this.selectedSet);
            let cardsFilteredByColor = this.filterCardsByColor(cardsFilteredBySet, this.selectedColor);
            this.filteredCards = [...cardsFilteredByColor];
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/color.scss";

.lorcana-page-container {
    border: 2px dotted red;
    display: flex;
    flex-direction: column;
    .filter-bar-container{
        height: 100px;
        border: 2px solid pink;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .set-filter-select, .color-filter-select{
            display: flex;
            flex-direction: column;
        }
    }
    .main-container {
        display: flex;
        justify-content: space-around;
        padding-top: 20px;

        .cards-container {
            border: 2px solid $tertiary;
            width: 70%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            .card-container {
                display: flex;
                flex-direction: column;
                max-width: 250px;
                justify-content: center;
                align-items: center;
                margin: 10px;

                img {
                    width: 100%;
                    border-radius: 15px;
                    margin-bottom: 10px;
                    border: 2px solid $tertiary;
                    &:hover {
                        scale: 125%;
                    }
                }

                button {
                    margin: 10px;
                }

            }
        }

        .deck-container {
            border: 2px solid $tertiary;
            width: 25%;
        }
    }
}</style>