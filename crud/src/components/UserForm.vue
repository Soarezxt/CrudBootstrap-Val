<template>
  <div class="modal fade show" tabindex="-1" role="dialog" style="display: block; background: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ internalUser.id ? 'Editar Usuário' : 'Adicionar Usuário' }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close" aria-hidden="true"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label for="name" class="form-label">Nome</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="internalUser.name"
                @input="validateName"
                required
                placeholder="Digite seu nome!"
              >
              <div v-if="nameError" class="text-danger">{{ nameError }}</div>
            </div>
            <div class="mb-3">
              <label for="dataNascimento" class="form-label">Data de Nascimento</label>
              <flat-pickr class="form-control" v-model="internalUser.dataNascimento" :config="flatpickrConfig" placeholder="##/##/####"></flat-pickr>
            </div>
            <div class="mb-3">
              <label for="cpf" class="form-label">CPF</label>
              <input
                type="text"
                class="form-control"
                id="cpf"
                v-model="internalUser.cpf"
                @input="formatCPF"
                placeholder="###.###.###-##"
                maxlength="14"
                required
              >
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="internalUser.email" required placeholder="Digite seu email!">
            </div>
            <button type="submit" class="btn btn-primary" :disabled="nameError">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  components: {
    FlatPickr,
  },
  props: {
    user: {
      type: Object,
      default: () => ({ name: '', dataNascimento: '', cpf: '', email: '' }),
    },
  },
  data() {
    return {
      internalUser: { ...this.user },
      flatpickrConfig: {
        dateFormat: 'd/m/Y',
        maxDate: new Date(),
      },
      nameError: null,
    };
  },
  methods: {
    validateName() {
      const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; 
      if (!namePattern.test(this.internalUser.name)) {
        this.nameError = 'O nome deve conter apenas letras e espaços.';
      } else if (this.internalUser.name.length < 4) {
        this.nameError = 'O nome deve ter pelo menos 4 caracteres.';
      } else {
        this.nameError = null;
      }
    },
    async updateUser() {
      if (this.nameError) return;
      try {
        if (this.internalUser.id) {
          await axios.put(`http://localhost:3000/pessoas/${this.internalUser.id}`, this.internalUser);
          this.$emit('alert', 'Usuário atualizado com sucesso!');
        } else {
          await axios.post('http://localhost:3000/pessoas', this.internalUser);
          this.$emit('alert', 'Usuário adicionado com sucesso!');
        }
        this.$emit('save');
        this.close();
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário. Por favor, tente novamente mais tarde.');
      }
    },
    close() {
      this.$emit('close');
    },
    formatCPF(event) {
      let cpf = event.target.value.replace(/\D/g, '');
      if (cpf.length > 3 && cpf.length <= 6) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      } else if (cpf.length > 6 && cpf.length <= 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
      } else if (cpf.length > 9 && cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
      }
      this.internalUser.cpf = cpf;
    },
  },
  watch: {
    user(newUser) {
      this.internalUser = { ...newUser };
    },
  },
};
</script>

<style scoped>
</style>
