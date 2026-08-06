import { Card, Empty, Table, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { patientPortalApi } from "../api/patient-portal.api";
import type { PatientAppointment } from "../types/patient-portal.types";
const { Title, Text } = Typography;
export function PatientAppointmentsPage() { const query = useQuery({ queryKey:["patient-appointments"], queryFn: patientPortalApi.appointments }); return <><Title level={2}>Mis citas</Title><Text type="secondary">Aquí encontrarás únicamente las citas que tienes registradas.</Text><Card style={{ marginTop:24 }}><Table<PatientAppointment> rowKey="id" loading={query.isLoading} dataSource={query.data} locale={{ emptyText:<Empty description="Aún no tienes citas registradas" /> }} columns={[{ title:"Fecha", render:(_,a)=>new Date(`${a.date}T00:00:00`).toLocaleDateString("es-PE") },{title:"Hora",dataIndex:"time",render:(time:string)=>time.slice(0,5)},{title:"Doctor",dataIndex:"doctorName"},{title:"Clínica",dataIndex:"clinicName",render:(v:string)=>v||"-"},{title:"Estado",dataIndex:"status",render:(v:string)=><Tag color="blue">{v}</Tag>}]} /></Card></>; }
