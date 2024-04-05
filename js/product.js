const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const Home = {
  template: `
        <div >
        <div class="row row-50 justify-content-center">
        <div class="col-12 text-center col-md-10 col-lg-8">
          <div class="section-name wow fadeInLeft" data-wow-delay=".2s">Products</div>
          <h3 class="wow fadeInRight text-capitalize" data-wow-delay=".3s">Products for your <span class="text-primary">
              Home & business</span></h3>
          <p>From home automation devices to IT infrastructure components, our products are carefully selected
            to meet the highest standards of quality, performance, and reliability.</p>
        </div>
      </div>
            <div class="mx-3">
                <label for="categorySelect" class="font-weight-bold">Filter by Category : </label>
                <select id="categorySelect" v-model="selectedCategory" @change="applyCategoryFilter">
                    <option value=""> All Categories</option>
                    <option v-for="category in categories" :key="category">{{ category }}</option>
                </select>
            </div>
            <div class="row">
                <div v-for="product in displayedProducts" :key="product.id" class="col-lg-3 col-md-6 text-center wow fadeInDown" data-wow-delay=".1s">
                    <div class="card m-2">
                        <img :src="'./images/product/' + product.image" :alt="product.model" class="card-img mx-auto" style="height: 150px; width: auto;" >
                        <div class="card-body">
                            <h5 class="card-title">{{ product.model }}</h5>
                            <router-link :to="'/product/' + product.id" class="button-primary p-1 px-3">View Details</router-link>
                        </div>
                    </div>
                </div>
            </div>
            <nav aria-label="Page navigation" class="mb-3">
                <ul class="pagination justify-content-center mt-3">
                    <li class="page-item">
                        <a class="btn btn-primary px-3 m-3" :class="{ disabled: currentPage === 1 }" href="#" @click="prevPage"><span class="fa fa-chevron-left" /></a>
                    </li>
                    <li class="page-item" v-for="page in totalPages" :key="page">
                    <a class="btn btn-primary" :class="{ disabled: currentPage === page }" href="#" @click="changePage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" >
                    <a class="btn btn-primary px-3 m-3" :class="{ disabled: currentPage === totalPages }" href="#" @click="nextPage"><span class="fa fa-chevron-right" /></a>
                    </li>
                </ul>
            </nav>
        </div>
    `,
  data() {
    return {
      products: [], // Initialize products array
      categories: [], // Initialize categories array
      selectedCategory: "", // Selected category for filtering
      currentPage: 1,
      pageSize: 8, // Number of products per page
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    },
    filteredProducts() {
      let filtered = this.products;
      if (this.selectedCategory) {
        filtered = filtered.filter(
          (product) => product.category === this.selectedCategory
        );
      }
      return filtered;
      // const startIndex = (this.currentPage - 1) * this.pageSize;
      // const endIndex = startIndex + this.pageSize;
      // return filtered.slice(startIndex, endIndex);
    },
    // this is new line
    displayedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredProducts.slice(start, end);
    },
    // Calculate an array of page numbers for pagination
    pages() {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    },
    // Calculate unique categories from all products
    categories() {
      return [...new Set(this.products.map((product) => product.category))];
    },
    // end new line

    
  },

  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    applyCategoryFilter() {
      this.currentPage = 1; // Reset page to 1 when applying category filter
    },
  },

  created() {
    // Load data from local JSON file
    fetch("js/products.json")
      .then((response) => response.json())
      .then((data) => {
        this.products = data; // Update products array with fetched data
        // Extract unique categories from products
        this.categories = [...new Set(data.map((product) => product.category))];
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  },
};

const Product = {
  template: `
            <div v-if="selectedProduct">
            <router-link to="/" class="btn btn-primary m-3">Product Home</router-link>
            <div class="card mb-3">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img :src="'./images/product/' + selectedProduct.image" :alt="selectedProduct.model" class="card-img mx-auto" style="height:500px; width:auto;">
                </div>
                <div class="col-md-8 pl-5">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-sm-2">
                        <h5 class="card-title">Model :</h5>
                      </div>
                      <div class="col-sm">
                        <h5 class="card-title">{{ selectedProduct.model }}</h5>
                      </div>
                    </div>
                    <div class="row font-weight-bold">
                      <div class="col-sm-2">
                        <p class="card-text">Name : </p>
                      </div>
                      <div class="col-sm">
                        <p class="card-text">{{ selectedProduct.name }}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-2">
                        <p class="card-text">Description : </p>
                      </div>
                      <div class="col-sm">
                        <p class="card-text">{{ selectedProduct.description }}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-2">
                        <p class="card-text">Category : </p>   
                      </div>
                      <div class="col-sm">
                        <p class="card-text">{{ selectedProduct.category }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <router-link v-if="previousProductId" :to="'/product/' + previousProductId" class="btn btn-primary px-3 m-3"><span
                  class="fa fa-chevron-left" /></router-link>
                  <router-link to="/" class="btn btn-primary m-3"><span class="fa fa-home" /></router-link>
              <router-link v-if="nextProductId" :to="'/product/' + nextProductId" class="btn btn-primary px-3 m-3"><span
                  class="fa fa-chevron-right" /></router-link>
            </div>
          </div>
    `,

  computed: {
    selectedProduct() {
      return this.$route.params.id
        ? this.products.find((product) => product.id == this.$route.params.id)
        : null;
    },
    previousProductId() {
      if (!this.selectedProduct) return null;
      const index = this.products.findIndex(
        (product) => product.id == this.selectedProduct.id
      );
      return index > 0 ? this.products[index - 1].id : null;
    },
    nextProductId() {
      if (!this.selectedProduct) return null;
      const index = this.products.findIndex(
        (product) => product.id == this.selectedProduct.id
      );
      return index < this.products.length - 1
        ? this.products[index + 1].id
        : null;
    },
  },
  data() {
    return {
      products: [], // Initialize products array
    };
  },
  created() {
    // Load data from local JSON file
    fetch("js/products.json")
      .then((response) => response.json())
      .then((data) => {
        this.products = data; // Update products array with fetched data
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  },
};

const routes = [
  { path: "/", component: Home },
  { path: "/product/:id", component: Product },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp({});
app.use(router);
app.mount("#app");
