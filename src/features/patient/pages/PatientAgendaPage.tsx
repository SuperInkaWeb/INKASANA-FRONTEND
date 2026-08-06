import { CalendarOutlined } from "@ant-design/icons";
import { Card, Empty, List, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { patientPortalApi } from "../api/patient-portal.api";
const { Title, Text } = Typography;
export function PatientAgendaPage() { const query = useQuery({ queryKey:["patient-appointments"], queryFn: patientPortalApi.appointments }); const upcoming=(query.data??[]).filter(a=>new Date(`${a.date}T${a.time}`)>=new Date()); return <><Title level={2}>Mi agenda</Title><Text type="secondary">Tus fechas y horarios de atención registrados.</Text><Card style={{marginTop:24}}><List loading={query.isLoading} dataSource={upcoming} locale={{emptyText:<Empty description="No tienes citas próximas" />}} renderItem={a=><List.Item><List.Item.Meta avatar={<CalendarOutlined style={{fontSize:22,color:"#1677ff"}}/>} title={`${new Date(`${a.date}T00:00:00`).toLocaleDateString("es-PE",{dateStyle:"full"})} · ${a.time.slice(0,5)}`} description={`${a.doctorName}${a.clinicName?` · ${a.clinicName}`:""}`} /></List.Item>} /></Card></>; }
