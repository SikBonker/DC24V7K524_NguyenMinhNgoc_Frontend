<template>
    <Form @submit="submitContact" :validation-schema="contactFormSchema">
        <div class="form-group">
            <label for="name">Tên</label>
            <Field name="name" type="text" class="form-control" v-model="contactLocal.name" />
            <ErrorMessage name="name" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="email">E-mail</label>
            <Field name="email" type="email" class="form-control" v-model="contactLocal.email" />
            <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="address">Địa chỉ</label>
            <Field name="address" type="text" class="form-control" v-model="contactLocal.address" />
            <ErrorMessage name="address" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="phone">Điện thoại</label>
            <Field name="phone" type="tel" class="form-control" v-model="contactLocal.phone" />
            <ErrorMessage name="phone" class="error-feedback" />
        </div>

        <div class="form-group form-check">
            <input id="hobby-toggle" type="checkbox" class="form-check-input" v-model="showHobbyOptions"
                @change="toggleHobbyOptions" />
            <label class="form-check-label" for="hobby-toggle">
                <strong>Sở thích</strong>
            </label>
        </div>

        <div class="form-group" v-if="showHobbyOptions">
            <label class="d-block mb-2">Chọn sở thích</label>
            <Field name="hobby" v-slot="{ field }">
                <div class="hobby-options">
                    <div class="form-check hobby-option" v-for="option in hobbyOptions" :key="option.value">
                        <input :id="`hobby-${option.value}`" class="form-check-input" type="checkbox"
                            :checked="Array.isArray(field.value) && field.value.includes(option.value)"
                            @change="setHobby(field, option.value)" />
                        <label class="form-check-label" :for="`hobby-${option.value}`">
                            {{ option.label }}
                        </label>
                    </div>
                </div>
            </Field>
            <ErrorMessage name="hobby" class="error-feedback" />
        </div>

        <div class="form-group form-check">
            <input name="favorite" type="checkbox" class="form-check-input" v-model="contactLocal.favorite" />
            <label for="favorite" class="form-check-label">
                <strong>Liên hệ yêu thích</strong>
            </label>
        </div>

        <div class="form-group button-row">
            <button type="submit" class="btn btn-primary">Lưu</button>
            <button v-if="contactLocal._id" type="button" class="btn btn-danger" @click="deleteContact">
                Xóa
            </button>
            <button type="button" class="btn btn-secondary" @click="Cancel">
                Thoát
            </button>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:contact", "delete:contact"],
    props: {
        contact: { type: Object, required: true }
    },
    data() {
        // Tối ưu lại regex số điện thoại tại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
        const contactFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Tên phải có giá trị.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            email: yup
                .string()
                .email("E-mail không đúng định dạng.")
                .max(50, "E-mail tối đa 50 ký tự."),
            address: yup.string().max(100, "Địa chỉ tối đa 100 ký tự."),
            phone: yup
                .string()
                .matches(
                    /^(03|05|07|08|09)\d{8}$/,
                    "Số điện thoại không hợp lệ (phải gồm 10 số)."
                ),
            hobby: yup
                .array()
                .of(yup.string().max(50, "Sở thích tối đa 50 ký tự."))
                .default([]),
        });
        return {
            contactLocal: {
                ...this.contact,
                hobby: Array.isArray(this.contact.hobby)
                    ? this.contact.hobby
                    : this.contact.hobby
                        ? [this.contact.hobby]
                        : [],
            },
            showHobbyOptions: Array.isArray(this.contact.hobby)
                ? this.contact.hobby.length > 0
                : Boolean(this.contact.hobby),
            contactFormSchema,
            hobbyOptions: [
                { value: "Chơi game", label: "Chơi game" },
                { value: "Thể thao", label: "Thể thao" },
                { value: "Học tập", label: "Học tập" },
                { value: "Khác", label: "Khác" },
            ],
        };
    },
    watch: {
        contact: {
            handler(newContact) {
                this.contactLocal = {
                    ...newContact,
                    hobby: Array.isArray(newContact.hobby)
                        ? newContact.hobby
                        : newContact.hobby
                            ? [newContact.hobby]
                            : [],
                };
                this.showHobbyOptions = Array.isArray(newContact.hobby)
                    ? newContact.hobby.length > 0
                    : Boolean(newContact.hobby);
            },
            immediate: true,
        },
    },
    methods: {
        setHobby(field, value) {
            const currentValue = Array.isArray(field.value)
                ? field.value
                : field.value
                    ? [field.value]
                    : [];
            const newValue = currentValue.includes(value)
                ? currentValue.filter((item) => item !== value)
                : [...currentValue, value];
            field.value = newValue;
            this.contactLocal.hobby = newValue;
        },
        toggleHobbyOptions() {
            if (!this.showHobbyOptions) {
                this.contactLocal.hobby = [];
            }
        },
        async submitContact() {
            // Thêm await trước $emit để đợi component Cha xử lý xong API cập nhật
            await this.$emit("submit:contact", this.contactLocal);
        },
        deleteContact() {
            this.$emit("delete:contact", this.contactLocal._id);
        },
        Cancel() {
            const reply = window.confirm('Bạn có những thay đổi chưa lưu! Bạn có chắc chắn muốn thoát?');
            if (reply) {
                this.$router.push({ name: "contactbook" });
            }
        }
    },
};
</script>

<style scoped>
@import "@/assets/form.css";

/* Style bổ sung cho các thông báo lỗi */
.error-feedback {
    color: #dc3545;
    font-size: 0.875em;
    margin-top: 0.25rem;
    display: block;
}

.form-group {
    margin-bottom: 0.9rem;
}

.form-check {
    margin-bottom: 0.75rem;
}

.hobby-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
}

.hobby-option {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
}

button.btn {
    min-width: 90px;
}

@media (max-width: 576px) {
    .hobby-options {
        flex-direction: column;
        align-items: flex-start;
    }

    .button-row {
        flex-direction: column;
        align-items: stretch;
    }

    button.btn {
        width: 100%;
    }
}
</style>