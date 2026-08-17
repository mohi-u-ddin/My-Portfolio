import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { contactService } from "../../services/contactService";
import { isValidEmail, isNonEmpty, hasMinLength } from "../../utils/validators";
import { Button } from "../common/Button";
import type { ContactFormValues } from "../../types";
import "./ContactForm.css";

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

const initialValues: ContactFormValues = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const { t } = useLanguage();
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!isNonEmpty(values.name)) next.name = t.contact.validation.required;
    if (!isNonEmpty(values.email)) next.email = t.contact.validation.required;
    else if (!isValidEmail(values.email)) next.email = t.contact.validation.email;
    if (!isNonEmpty(values.subject)) next.subject = t.contact.validation.required;
    if (!isNonEmpty(values.message)) next.message = t.contact.validation.required;
    else if (!hasMinLength(values.message, 10)) next.message = t.contact.validation.minLength;
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      await contactService.sendMessage(values);
      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
    }
  }

  function handleChange(field: keyof ContactFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-name">{t.contact.formName}</label>
          <input
            id="cf-name"
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
          />
          {errors.name && <span className="contact-form__error" id="cf-name-error">{errors.name}</span>}
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-email">{t.contact.formEmail}</label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
          />
          {errors.email && <span className="contact-form__error" id="cf-email-error">{errors.email}</span>}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-subject">{t.contact.formSubject}</label>
        <input
          id="cf-subject"
          type="text"
          value={values.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "cf-subject-error" : undefined}
        />
        {errors.subject && <span className="contact-form__error" id="cf-subject-error">{errors.subject}</span>}
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-message">{t.contact.formMessage}</label>
        <textarea
          id="cf-message"
          rows={5}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
        />
        {errors.message && <span className="contact-form__error" id="cf-message-error">{errors.message}</span>}
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={status === "submitting"} icon={<Send size={16} />}>
        {status === "submitting" ? t.contact.sending : t.contact.send}
      </Button>

      {status === "success" && (
        <p className="contact-form__status contact-form__status--success" role="status">
          <CheckCircle2 size={16} /> {t.contact.success}
        </p>
      )}
      {status === "error" && (
        <p className="contact-form__status contact-form__status--error" role="alert">
          <AlertCircle size={16} /> {t.contact.error}
        </p>
      )}
    </form>
  );
}
