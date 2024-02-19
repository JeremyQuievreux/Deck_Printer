<template>
  <div>
    <div class="cards-container">
      <div v-for="(card, index) in selectedCards" :key="index" class="card-container">
        <p>{{ card.name }}</p>
        <img :src="card.pic_url" alt="" :style="{ width: '330px', height: '440px' }">
        <input type="number" v-model="card.quantity" min="0" @change="updateQuantity(index)">
      </div>
    </div>
    <button @click="generatePDF(selectedCards)">Test PDF</button>
  </div>
</template>
<script>
import { cards } from './data/cards';
import { jsPDF } from 'jspdf'; // Import de jsPDF
export default {
  data() {
    return {
      test : "Hello World",
      jeremy: "Jeremy",
      cards: [...cards, cards[0], cards[1]],
      selectedCards : cards.map(card => ({ ...card, quantity: 0 }))
    }
  },
  methods: {
    updateQuantity(index) {
      // Assurez-vous que la quantité est un entier positif
      this.selectedCards[index].quantity = Math.max(0, Math.floor(this.selectedCards[index].quantity));
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
          const card = selectedCards[j];
          for (let k = 0; k < card.quantity; k++) { // Boucle sur la quantité de chaque carte
            const row = Math.floor((j - i) / 3); // 3 cartes par ligne
            const col = (j - i) % 3; // 3 cartes par colonne
            const x = marginLeft + col * (cardWidth + horizontalSpacing); // Position x de la carte
            const y = marginTop + row * (cardHeight + verticalSpacing); // Position y de la carte
            // Fetch de l'image et conversion en blob
            const blob = await this.fetchImage(card.pic_url);

            // Conversion du blob en URL d'image
            const imgData = URL.createObjectURL(blob);

            // Ajout de l'image au PDF
            doc.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);
          }
        }
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
.cards-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card-container{
  display: flex;
  flex-direction: column;
  width: 30%;
  justify-content: center;
  align-items: center;
  input {
    margin-top: 20px;
  }
}
</style>
