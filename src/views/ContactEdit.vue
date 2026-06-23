<template>
    <div v-if="contact" class="page">
        <h4>Hiệu chỉnh Liên hệ</h4>
        <ContactForm :contact="contact" @submit:contact="updateContact" @delete:contact="deleteContact" />
        <p v-if="message" :class="['alert', messageType ? `alert-${messageType}` : 'alert-success', 'mt-2']">{{ message
            }}</p>
    </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
    components: {
        ContactForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            contact: null,
            message: "",
            messageType: "",
        };
    },
    methods: {
        async getContact(id) {
            try {
                this.contact = await ContactService.get(id);
            } catch (error) {
                console.error(error);
                this.message = error.response?.data?.message || "Không thể tải dữ liệu liên hệ.";
                this.messageType = "danger";
            }
        },
        async updateContact(data) {
            try {
                const id = this.contact?._id || this.id;
                await ContactService.update(id, data);
                this.message = "Liên hệ được cập nhật thành công.";
                this.messageType = "success";

                setTimeout(() => {
                    this.$router.push({ name: "contactbook" });
                }, 1500);
            } catch (error) {
                console.error(error);
                this.message = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật liên hệ.";
                this.messageType = "danger";
            }
        },
        async deleteContact() {
            if (confirm("Bạn muốn xóa Liên hệ này?")) {
                try {
                    await ContactService.delete(this.contact._id);
                    this.$router.push({ name: "contactbook" });
                } catch (error) {
                    console.error(error);
                    this.message = error.response?.data?.message || "Có lỗi xảy ra khi xóa liên hệ.";
                    this.messageType = "danger";
                }
            }
        },
    },
    created() {
        this.getContact(this.id);
        this.message = "";
    },
};
</script>

<style scoped>
.page {
    max-width: 400px;
    margin: auto;
}
</style>