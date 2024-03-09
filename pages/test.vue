<template>
    <div class="main-container">
        <div class="cards-container">
            <div v-for="(card, index) in cards" :key="index" class="card-container">
                <p>{{ card.name }}</p>
                <img :src="card.image" alt="">
                <button @click="addToDeck(card)" :disabled="isAlreadyInDeck(card)">{{ !isAlreadyInDeck(card) ? "add to deck" : "already in deck" }}</button>
            </div>
        </div>
        <div class="deck-container">
            <p>Deck container</p>
            <div v-for="selectedCard in selectedCards" class="deck-line">
                <p >{{ selectedCard.name }}</p>
                <button @click="decrementCard(selectedCard)">-</button>
                <p>{{ selectedCard.quantity }}</p>
                <button @click="incrementCard(selectedCard)">+</button>
            </div>
        </div>
        <button @click="generatePDF(selectedCards)">Test PDF</button>
    </div>
</template>
<script>
import { lorcanaAllCards } from '../data/lorcana/lorcanaAllCards';
import { jsPDF } from 'jspdf'; // Import de jsPDF
import backImageUrl from "../img/back.png";
export default {
    data() {
        return {
            test: "Hello World",
            jeremy: "Jeremy",
            cards: [...lorcanaAllCards],
            selectedCards: [],
            backImageUrl: backImageUrl
        }
    },
    methods: {
        returnUrlImg(card) {
            return `../img/cards/lorcana/chapter_3/${card.id}.png`
        },
        updateQuantity(index) {
            // Assurez-vous que la quantité est un entier positif
            this.selectedCards[index].quantity = Math.max(0, Math.floor(this.selectedCards[index].quantity));
        },
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
        incrementCard(card){
            card.quantity += 1
        },
        decrementCard(card){
            if (card.quantity > 0) {
                card.quantity -= 1
            }
        },
        addToDeck(card){
            console.log("click add to deck");
            console.log("card : ", card.id);
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
            doc.save('cartes_pokemon.pdf');
        },
        async fetchImage(url) {
            const response = await fetch(url);
            const blob = await response.blob();
            return blob;
        }
    }
}
</script>

<style lang="scss">
.main-container {
    display: flex;
    .cards-container {
        border: 2px solid red;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 70%;
    }
    
    .card-container {
        border: 2px solid green;
        display: flex;
        flex-direction: column;
        max-width: 250px;
        justify-content: center;
        align-items: center;
        img{
            width: 100%;
        }
        input {
            margin-top: 20px;
        }
    }
    .deck-container {
        border: 2px solid blue;
        width: 30%;
        .deck-line{
            border: 2px solid pink;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
