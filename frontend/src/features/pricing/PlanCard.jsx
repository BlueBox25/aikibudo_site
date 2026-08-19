import { Button, Card } from '../../ui'
import { cx } from '../../ui/cx'
import styles from './pricing.module.css'

export default function PlanCard({ plan, currency }) {
  return (
    <Card className={cx(styles.plan, plan.popular && styles.popular)}>
      {plan.popular && <span className={styles.ribbon}>Cel mai ales</span>}

      <h4 className={styles.planName}>{plan.name}</h4>

      <p className={styles.price}>
        <span className={styles.priceValue}>{plan.price}</span>
        <span className={styles.priceUnit}>
          {currency} / {plan.period}
        </span>
      </p>

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <div className={styles.planFoot}>
        <Button to="/contact" variant={plan.popular ? 'accent' : 'default'}>
          Înscrie-te
        </Button>
      </div>
    </Card>
  )
}
