<template>
    <div class="page">
        <h4>Thêm Liên hệ</h4>
        <ContactForm :contact="contact" @submit:contact="createContact" />
    </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactForm,
    },
    data() {
        return {
            contact: {
                name: "",
                email: "",
                address: "",
                phone: "",
                hobby: "",
                favorite: false,
            },
        };
    },
    methods: {
        async createContact(data) {
            try {
                await ContactService.create(data);
                alert("Liên hệ đã được thêm thành công.");
                this.$router.push({ name: "contactbook" });
            } catch (error) {
                console.log(error);
                alert("Lỗi khi lưu liên hệ. Vui lòng thử lại.");
            }
        },
    },
};
</script>

<style scoped>
.page {
    max-width: 400px;
    margin: auto;
}
</style>
