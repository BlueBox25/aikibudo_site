import { Container, Prose, Section, SectionHeading } from '../../ui'
import { Accordion, AccordionItem } from '../../ui/Accordion'
import styles from './disciplines.module.css'

/**
 * The long-form material for a discipline, collapsed by default. Everything
 * stays on the page for anyone who wants it, but the page opens short.
 */
export default function DisciplineArticle({ discipline }) {
  const {
    name,
    sections = [],
    concepts = [],
    quotes = [],
    techniques,
    bushido,
    sessionStructure,
    curriculum,
    equipment,
    training,
    callouts = [],
  } = discipline

  const hasAnything =
    sections.length || concepts.length || techniques || bushido || sessionStructure ||
    curriculum || equipment || training || callouts.length

  if (!hasAnything) return null

  return (
    <Section tight>
      <Container>
        <SectionHeading
          kicker="Despre disciplină"
          title={`Mai multe despre ${name}`}
          lede="Apasă pe o secțiune pentru a o deschide."
        />

        {quotes.map((quote) => (
          <blockquote key={quote.text} className={styles.quote}>
            <p className={styles.quoteText}>{quote.text}</p>
            <footer className={styles.quoteAuthor}>
              {quote.author}
              {quote.role ? ` · ${quote.role}` : ''}
            </footer>
          </blockquote>
        ))}

        <Accordion>
          {sections.map((section, index) => (
            <AccordionItem
              key={section.heading}
              title={section.heading}
              defaultOpen={index === 0}
            >
              <Prose>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </Prose>
            </AccordionItem>
          ))}

          {techniques && (
            <AccordionItem title={techniques.title}>
              <ul className={styles.checklist}>
                {techniques.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {concepts.length > 0 && (
            <AccordionItem title="Concepte fundamentale">
              <div className={styles.concepts}>
                {concepts.map((concept) => (
                  <article key={concept.name}>
                    <h3 className={styles.conceptName}>
                      {concept.name}
                      {concept.japanese && (
                        <span className={styles.conceptJp}>{concept.japanese}</span>
                      )}
                    </h3>
                    <p className={styles.conceptBody}>{concept.body}</p>
                    {concept.list && (
                      <ul className={styles.conceptList}>
                        {concept.list.map((item) => (
                          <li key={item.slice(0, 40)}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </AccordionItem>
          )}

          {bushido && (
            <AccordionItem title={bushido.title}>
              <div className={styles.virtues}>
                {bushido.virtues.map((virtue) => (
                  <div key={virtue.romaji} className={styles.virtue}>
                    <span className={styles.virtueKanji}>{virtue.kanji}</span>
                    <p className={styles.virtueRomaji}>{virtue.romaji}</p>
                    <p className={styles.virtueMeaning}>{virtue.meaning}</p>
                  </div>
                ))}
              </div>
            </AccordionItem>
          )}

          {sessionStructure && (
            <AccordionItem title={sessionStructure.title}>
              <Prose>
                <p>{sessionStructure.intro}</p>
              </Prose>
              <ol className={styles.steps} style={{ marginTop: '1.5rem' }}>
                {sessionStructure.steps.map((step) => (
                  <li key={step.slice(0, 40)} className={styles.step}>
                    {step}
                  </li>
                ))}
              </ol>
            </AccordionItem>
          )}

          {training && (
            <AccordionItem title="Cum arată antrenamentul">
              <Prose>
                <p>{training.intro}</p>
              </Prose>
              {training.groups.map((group) => (
                <div key={group.title} style={{ marginTop: '2rem' }}>
                  <h3 className={styles.conceptName}>{group.title}</h3>
                  <div className={styles.terms} style={{ marginTop: '1rem' }}>
                    {group.items.map((item) => (
                      <div key={item.term}>
                        <p className={styles.termName}>{item.term}</p>
                        <p className={styles.termText}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {training.outro && (
                <Prose style={{ marginTop: '2rem' }}>
                  <p>{training.outro}</p>
                </Prose>
              )}
            </AccordionItem>
          )}

          {curriculum && (
            <AccordionItem title={curriculum.title}>
              <ul className={styles.checklist}>
                {curriculum.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {equipment && (
            <AccordionItem title={equipment.title}>
              <ul className={styles.checklist}>
                {equipment.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {callouts.length > 0 && (
            <AccordionItem title="Cum începi">
              <div className={styles.concepts}>
                {callouts.map((callout) => (
                  <article key={callout.title}>
                    <h3 className={styles.conceptName}>{callout.title}</h3>
                    <p className={styles.conceptBody}>{callout.text}</p>
                  </article>
                ))}
              </div>
            </AccordionItem>
          )}
        </Accordion>
      </Container>
    </Section>
  )
}
