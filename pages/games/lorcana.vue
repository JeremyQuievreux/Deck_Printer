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
                <label for="color-filter">Choisir la couleur : </label>
                <select name="color-filter" id="color-filter" v-model="selectedColor" @change="onFilterChange">
                    <option value="all">...</option>
                    <option v-for="(color, index) in lorcanaColorsEnumeration" :key="index" :value="color.value">{{ color.label }}</option>
                </select>
            </div>
            <div class="color-filter-select">
                <label for="color-filter">Choisir la raretée : </label>
                <select name="color-filter" id="color-filter" v-model="selectedRarity" @change="onFilterChange">
                    <option value="all">...</option>
                    <option v-for="(rarity, index) in lorcanaRarityEnumeration" :key="index" :value="rarity.value">{{ rarity.label }}</option>
                </select>
            </div>
        </div>
        <div class="main-container">
            <div class="cards-container">
                <div v-for="(card, index) in filteredCards" :key="index" class="card-container">
                    <NuxtImg :src="card.image" loading="lazy"/>
                    <button @click="addToDeck(card)" :disabled="isAlreadyInDeck(card)">{{ !isAlreadyInDeck(card) ? "add to deck" : "already in deck" }}</button>
                </div>
            </div>
            <div class="deck-container">
                <div v-for="(card, index) in selectedCards" :key="index" class="deck-card-container">
                    <p >{{ card.id }}</p>
                    <button @click="decrementCard(card)">-</button>
                    <p>{{ card.quantity }}</p>
                    <button @click="incrementCard(card)">+</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import lorcanaAllCards from '../data/lorcana/lorcanaAllCards.js';
import { lorcanaSetsEnumeration, lorcanaColorsEnumeration, lorcanaRarityEnumeration } from '../data/enumeration';

export default {
    data() {
        return {
            filteredCards: [],
            selectedCards: [],
            lorcanaSetsEnumeration: lorcanaSetsEnumeration,
            lorcanaColorsEnumeration: lorcanaColorsEnumeration,
            lorcanaRarityEnumeration: lorcanaRarityEnumeration,
            selectedSet: "all",
            selectedColor: "all",
            selectedRarity: "all"
        }
    },
    created() {
        this.filteredCards = lorcanaAllCards;
    },
    methods: {
        isAlreadyInDeck(card){
            const index = this.selectedCards.findIndex(selectedCard => selectedCard.id === card.id);

            if (index !== -1) {
                // Si l'objet existe déjà, incrémenter la propriété quantity
                return true
            } else {
                // Si l'objet n'existe pas, l'ajouter à l'array avec une propriété quantity de 1
                return false
            }
        },
        addToDeck(card){
            const index = this.selectedCards.findIndex(selectedCard => selectedCard.id === card.id);

            if (index !== -1) {
                // Si l'objet existe déjà, incrémenter la propriété quantity
                this.selectedCards[index].quantity += 1;
            } else {
                // Si l'objet n'existe pas, l'ajouter à l'array avec une propriété quantity de 1
                card.quantity = 1;
                this.selectedCards.push(card);
            }
        },
        incrementCard(card){
            card.quantity += 1
        },
        decrementCard(card){
            if (card.quantity > 1) {
                card.quantity -= 1
            } else {
                let indexToDelete = this.selectedCards.findIndex(selectedCard => selectedCard.id == card.id);
                this.selectedCards.splice(indexToDelete, 1)
            }
        },
        filterCardsBySet(cardsToFilter, setFilter){
            if (setFilter == "all") {
                return cardsToFilter
            } else {
                return cardsToFilter.filter((card) => card.set == setFilter)
            }
        },
        filterCardsByRarity(cardsToFilter, rarityFilter){
            if (rarityFilter == "all") {
                return cardsToFilter
            } else {
                return cardsToFilter.filter((card) => card.rarity == rarityFilter)
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
            let cardsFilteredByRarity = this.filterCardsByRarity(cardsFilteredByColor, this.selectedRarity);
            this.filteredCards = [...cardsFilteredByRarity];
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../style/color.scss";

.lorcana-page-container {
    display: flex;
    flex-direction: column;
    .filter-bar-container{
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