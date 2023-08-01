<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal">
        <div v-if="isEmpty">
          <p class="error">You must not have an empty field</p>
        </div>
        <div v-if="!isWellFormated">
          <p class="error">Channel name and password must be between 3 and 20 caracteres</p>
          <p class="error"></p>
        </div>
        <input v-model="channelName" placeholder="Channel name"/>
        <div v-for="category in categories" :key="category.id" class="radio-item">
          <input type="radio" :id="category.id" :value="category.id" v-model="selectedCategory">
          <label :for="category.id">{{ category.name }}</label>
        </div>
        <div v-if="selectedCategory === 3">
          <input v-model="password" placeholder="Password" type="password"/>
        </div>
        <form @submit.prevent="createChannel">
            <button type="submit">Create</button>
        </form>
        <form @submit.prevent="close">
          <button>Close</button>
        </form>
      </div>
    </div>
  </template>
  
<script>
export default {
  name: 'CreateChannel',
  props: {
    show: Boolean,
  },
  data()
  {
    return {
      selectedCategory: 0,
      categories: [
        { id: 1, name: 'Public'}, 
        { id: 2, name: 'Private'}, 
        { id: 3, name: 'Protected by password'}, 
      ],
      password: '',
      channelName: '',
      isEmpty: false,
      isWellFormated: true,
    }
  },
  methods: 
  {
    createChannel()
    {
      if (this.selectedCategory === 0 
        || this.channelName === '' 
        || (this.selectedCategory === 3 && this.password === ''))
      {
        this.isEmpty = true;
        this.isWellFormated = true;
        return ;
      }
      if ((this.selectedCategory === 3 && (this.password.length > 20
        || this.password.length < 3))
        || this.channelName.length > 20 
        || this.channelName.length < 3)
      {
        this.isEmpty = false;
        this.isWellFormated = false;
        return ;
      }

      this.$emit('create-channel', {
        channel: {
          name: this.channelName,
          password: this.password,
          category: this.categories[this.selectedCategory - 1].name,
          isADm: false,
        }
      });
      this.resetData();
    },
    close()
    {
      this.resetData();
      this.$emit('close');
    },
    resetData()
    {
      this.isEmpty = false;
      this.password = '';
      this.channelName = '';
      this.selectedCategory = 0;
      this.isWellFormated = true;
    }
  }
};
</script>
  
<style>

.radio-container 
{
  display: flex;
  flex-direction: column;
}

  </style>
  