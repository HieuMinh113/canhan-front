<template>
  <div class="contact-page">
    <h1 class="animate-pulse">📞 Liên hệ với chúng tôi</h1>
    <p class="subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy điền thông tin bên dưới để liên hệ với chúng tôi!</p>
  
    <form @submit.prevent="submitForm" class="contact-form">
      <div class="form-group">
        <label for="name">👤 Tên của bạn:</label>
        <input type="text" id="name" v-model="form.name" required placeholder="Nhập tên của bạn" />
      </div>
  
      <div class="form-group">
        <label for="email">📧 Email:</label>
        <input type="email" id="email" v-model="form.email" required placeholder="Nhập email của bạn" />
      </div>
  
      <div class="form-group">
        <label for="message">💬 Tin nhắn:</label>
        <textarea id="message" v-model="form.message" required placeholder="Nhập tin nhắn của bạn"></textarea>
      </div>
  
      <button type="submit" class="submit-btn">📨 Gửi</button>
    </form>
  
    <div v-if="isSubmitted" class="success-message">
      <p>✅ Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      isSubmitted: false 
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('/api/contact', {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Lỗi khi gửi liên hệ");
        }

        this.isSubmitted = true;
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';

      } catch (error) {
        alert("❌ Gửi liên hệ thất bại: " + error.message);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.contact-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 60px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.contact-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/paws.png') repeat;
  opacity: 0.2;
  animation: slidePaws 20s linear infinite;
}

@keyframes slidePaws {
  0% { background-position: 0 0; }
  100% { background-position: 200px 200px; }
}

h1 {
  font-size: 3rem;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 20px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  animation: pulse 2s ease infinite;
}

.subtitle {
  font-size: 1.3rem;
  color: #4a4a4a;
  margin-bottom: 40px;
  line-height: 1.8;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1.2s ease-in-out;
}

.contact-form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto 50px;
  background: rgba(255, 255, 255, 0.97);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease forwards;
  backdrop-filter: blur(8px);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
  display: block;
}

input, textarea {
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  font-size: 1.1rem;
  color: #333;
  width: 100%;
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

textarea {
  min-height: 160px;
  resize: vertical;
}

.submit-btn {
  margin-top: 30px;
  padding: 14px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.submit-btn:hover::before {
  width: 300px;
  height: 300px;
}

.submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(42, 157, 143, 0.5);
}

.success-message {
  max-width: 600px;
  margin: 30px auto 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.8s ease;
  border-left: 5px solid #2a9d8f;
}

.success-message p {
  font-size: 1.3rem;
  color: #2a9d8f;
  font-weight: 600;
  line-height: 1.6;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 30px 15px;
  }
  h1 {
    font-size: 2.4rem;
  }
  .subtitle {
    font-size: 1.2rem;
    max-width: 600px;
  }
  .contact-form {
    padding: 25px;
    max-width: 90%;
  }
  .success-message {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1.1rem;
  }
  .contact-form {
    padding: 20px;
  }
  input, textarea, .submit-btn {
    font-size: 1rem;
    padding: 12px;
  }
  .success-message p {
    font-size: 1.1rem;
  }
}
</style>