import { useAuth0 } from "@auth0/auth0-react";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Upload, message, Typography } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../../../app/store/auth.store";
import { setAuthToken } from "../../../shared/api/api";
import { patientPortalApi } from "../api/patient-portal.api";

const { Title, Text } = Typography;

export function PatientProfilePage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { logout } = useAuth0();
  const { logout: logoutInternal } = useAuthStore();
  const profile = useQuery({ queryKey: ["patient-profile"], queryFn: patientPortalApi.getProfile });

  useEffect(() => { if (profile.data) form.setFieldsValue(profile.data); }, [form, profile.data]);

  const save = async () => {
    try { await patientPortalApi.updateProfile(await form.validateFields()); message.success("Perfil actualizado"); queryClient.invalidateQueries({ queryKey: ["patient-profile"] }); }
    catch { message.error("No se pudo actualizar el perfil"); }
  };
  const upload = async (file: File) => {
    try { await patientPortalApi.uploadAvatar(file); message.success("Foto actualizada"); queryClient.invalidateQueries({ queryKey: ["patient-profile"] }); }
    catch { message.error("No se pudo subir la foto"); }
    return false;
  };
  const signOut = () => {
    setAuthToken(null);
    logoutInternal();
    logout({ logoutParams: { returnTo: `${window.location.origin}/marketplace/clinics` } });
  };

  return <Card loading={profile.isLoading} style={{ maxWidth: 700 }}><Title level={2}>Mi perfil</Title><Text type="secondary">Completa tus datos para que las clínicas te identifiquen correctamente.</Text><div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: 16 }}><Avatar size={76} src={profile.data?.avatarUrl} icon={<UserOutlined />} /><Upload showUploadList={false} beforeUpload={upload} accept="image/*"><Button icon={<InboxOutlined />}>Arrastrar o elegir foto</Button></Upload></div><Form form={form} layout="vertical"><Form.Item name="firstName" label="Nombres" rules={[{ required: true, message: "Ingresa tus nombres" }]}><Input /></Form.Item><Form.Item name="lastName" label="Apellidos" rules={[{ required: true, message: "Ingresa tus apellidos" }]}><Input /></Form.Item><Form.Item name="dni" label="DNI" rules={[{ required: true, message: "Ingresa tu DNI" }]}><Input maxLength={12} /></Form.Item><Button type="primary" onClick={save}>Guardar cambios</Button><Button danger style={{ marginLeft: 12 }} onClick={signOut}>Cerrar sesión</Button></Form></Card>;
}
