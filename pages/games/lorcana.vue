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
            <div>
                <h3>Resultat : {{ filteredCards ? filteredCards.length : 0 }}</h3>
            </div>
        </div>
        <div class="main-container">
            <div class="cards-container">
                <div v-for="(card, index) in filteredCards" :key="index" class="card-container">
                    <NuxtImg :src="card.image" loading="lazy"/>
                    <div class="add-card-btn" @click=" !isAlreadyInDeck(card)&& addToDeck(card)" :disabled="isAlreadyInDeck(card)">
                        {{ !isAlreadyInDeck(card) ? "Ajouter a la liste" : "Deja dans la liste" }}
                    </div>
                    <!-- <button @click="addToDeck(card)" :disabled="isAlreadyInDeck(card)">{{ !isAlreadyInDeck(card) ? "Ajouter a la liste" : "Deja dans la liste" }}</button> -->
                </div>
            </div>
            <div class="deck-container">

                <div class="deck-container-title">
                    <div class="generate-btn" @click="generatePDF(selectedCards)">
                        Générer PDF
                    </div>
                    <div class="count-line">
                        <p>Cartes selectionnées : </p>
                        <p class="count-number">{{ deckCardsCount }}</p>
                    </div>
                    <div class="sheet-conuter">
                        <p>Nombre de page : </p>
                        <p class="count-number">{{ Math.ceil(deckCardsCount / 9) }}</p>
                    </div>
                    <div class="sheet-conuter">
                        <p>Slot vide dans la derniere page : </p>
                        <p class="count-number">{{ 9 - (deckCardsCount % 9) == 9 ? 0 : 9 - (deckCardsCount % 9) }}</p>
                    </div>
                </div>
                <div v-for="(card, index) in selectedCards" :key="index" class="deck-card-container">
                    <div class="deck-card-img">
                        <NuxtImg  :src="card.image" loading="lazy"/>
                    </div>
                    <div class="deck-card-name">
                        <p>{{ card.name.split(' - ')[0] }}</p>
                        <p>{{ card.name.split(' - ')[1] }}</p>
                    </div>
                    <div class="quantity-widget">
                        <div class="quantity-btn" @click="decrementCard(card)">-</div>
                        <p>{{ card.quantity }}</p>
                        <div class="quantity-btn" @click="incrementCard(card)">+</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import lorcanaAllCards from '../data/lorcana/lorcanaAllCards.js';
import { lorcanaSetsEnumeration, lorcanaColorsEnumeration, lorcanaRarityEnumeration } from '../data/enumeration';
import { jsPDF } from 'jspdf'; 
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
    computed: {
        deckCardsCount() {
            let count = 0
            this.selectedCards.forEach((sCard) => {
                count += sCard.quantity
            })
            console.log(count);
            return count
        }
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
        },
        async generatePDF(selectedCards) {

            let nouveauTableau = [];

            // Parcourir chaque objet dans le tableau donné
            selectedCards.forEach(objet => {
                // Vérifier si la quantité est supérieure à 0
                if (objet.quantity > 0) {
                    // Ajouter l'objet autant de fois que spécifié par sa quantité
                    for (let i = 0; i < objet.quantity; i++) {
                        nouveauTableau.push(objet);
                    }
                }
            });
            this.generatePDFWithQuantity(nouveauTableau);
        },
        async generatePDFWithQuantity(selectedCards) {
            // Création d'une instance jspdf
            const doc = new jsPDF();

            // Calcul de la taille de la page
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Calcul des marges
            const marginLeft = (pageWidth - 3 * 63 - 2 * 1) / 2; // Marge gauche
            const marginTop = (pageHeight - 3 * 88 - 2 * 1) / 2; // Marge supérieure

            // Dimensions et espacements des cartes
            const cardWidth = 63; // Largeur de la carte
            const cardHeight = 88; // Hauteur de la carte
            const horizontalSpacing = 1; // Espacement horizontal (en mm)
            const verticalSpacing = 1; // Espacement vertical (en mm)
            const cardsPerPage = 9; // Nombre de cartes par page

            let pageNumber = 1;
            for (let i = 0; i < selectedCards.length; i += cardsPerPage) {
                if (pageNumber > 1) {
                    doc.addPage(); // Ajoute une nouvelle page après la première
                }
                for (let j = i; j < i + cardsPerPage && j < selectedCards.length; j++) {
                    const row = Math.floor((j - i) / 3); // 3 cartes par ligne
                    const col = (j - i) % 3; // 3 cartes par colonne
                    const x = marginLeft + col * (cardWidth + horizontalSpacing); // Position x de la carte
                    const y = marginTop + row * (cardHeight + verticalSpacing); // Position y de la carte
                    doc.addImage(selectedCards[j].image, 'PNG', x, y, cardWidth, cardHeight);
                }
                // // Ajouter une page vide après chaque page de cartes
                // doc.addPage();

                // // Ajouter neuf images du dos de la carte sur la page vide
                // for (let k = 0; k < 3; k++) {
                //     for (let l = 0; l < 3; l++) {
                //         const x = marginLeft + k * (cardWidth + horizontalSpacing);
                //         const y = marginTop + l * (cardHeight + verticalSpacing);
                //         doc.addImage(this.backImageUrl, 'PNG', x, y, cardWidth, cardHeight);
                //     }
                // }

                pageNumber++;
            }

            // Enregistrement et téléchargement du PDF
            doc.save('Loracana_cards.pdf');
        },
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
        padding-top: 10px;
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

                .add-card-btn {
                    margin: 10px;
                    background-color: $primary;
                    border: 2px solid $tertiary;
                    border-radius: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 30px;
                    width: calc(100% - 20px);
                    cursor: pointer;
                    user-select: none;
                    margin: 10px;
                    &:hover{
                        background-color: white;
                        color: $primary;
                    }
                }

            }
        }

        .deck-container {
            border: 2px solid $tertiary;
            width: 25%;
            .deck-container-title{
                display: flex;
                flex-direction: column;
                .generate-btn{
                    background-color: $primary;
                    border: 2px solid $tertiary;
                    border-radius: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 30px;
                    width: calc(100% - 20px);
                    cursor: pointer;
                    user-select: none;
                    margin: 10px;
                    &:hover{
                        background-color: white;
                        color: $primary;
                    }
                }
                .count-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin: 5px;
                }
                .sheet-conuter{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin: 5px;
                }
                .count-number{
                    height: 30px;
                    min-width: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: $primary;
                    border: 2px solid $tertiary;
                    border-radius: 15px;
                }
            }
            .deck-card-container{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 75px;
                border: 2px solid $tertiary;
                border-radius: 15px;
                margin: 5px;
                .deck-card-img{
                    width: 20%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    img{
                        height: 100%;
                    }
                }
                .deck-card-name{
                    width: 50%;
                    p {
                        margin: 5px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .quantity-widget{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 25%;
                    .quantity-btn{
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 2px solid $tertiary;
                        background-color: $primary;
                        cursor: pointer;
                        user-select: none;
                        &:hover{
                            background-color: white;
                            color: $primary;
                        }
                    }
                }
            }
        }
    }
}</style>