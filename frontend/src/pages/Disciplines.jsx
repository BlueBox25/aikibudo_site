import { Container, Section } from '../ui'
import { useContent } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import DisciplineGrid from '../features/disciplines/DisciplineGrid'
import PageHeader from './PageHeader'
import { DefaultCta } from './CtaBand'

export default function Disciplines() {
  const { data } = useContent()
  useDocumentTitle('Discipline')

  return (
    <>
      <PageHeader
        kicker="Ce practicăm"
        title="Discipline"
        lede="Patru arte, predate de instructori cu experiență internațională. Alege una și citește despre principiile ei, grupele de vârstă și orarul propriu."
      />

      <Section tight>
        <Container>
          <DisciplineGrid disciplines={data.disciplines} />
        </Container>
      </Section>

      <DefaultCta />
    </>
  )
}
