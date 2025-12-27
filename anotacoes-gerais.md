#### Logica 001

- Conversa com o Gemini
  > > https://gemini.google.com/share/1e05c057365e

```
-- O Webhook recebeu a notificação de sucesso para o payment_id 1050

-- 1. Marca como pago
UPDATE subscription_payments
SET status = 'paid', paid_at = NOW()
WHERE id = 1050;

-- 2. ATUALIZA A ASSINATURA (A Troca de Plano Real)
-- Descobrimos qual plano ele pagou baseando-nos no valor ou metadados
-- Mas a forma mais segura é passar o plan_id no metadata do Pix ou buscar na lógica

UPDATE subscriptions
SET
    plan_id = [ID_PLANO_NOVO], -- AQUI ele sai do plano Trial (ID 1) para o Pro (ID 2)
    status = 'active',
    current_period_start = NOW(),
    -- Importante: Recalcula a data de fim baseada na duração do NOVO plano
    current_period_end = NOW() + (SELECT make_interval(days => days_duration) FROM plans WHERE id = [ID_PLANO_NOVO]),
    updated_at = NOW()
WHERE id = (SELECT subscription_id FROM subscription_payments WHERE id = 1050);

-- 3. Agenda a Nota Fiscal
INSERT INTO invoices ...
```

#### Logica 002 - Criacao da Conta

-- 1. Cria o Time
INSERT INTO teams (name) VALUES ('Minha Empresa') RETURNING id;

-- 2. Cria a Assinatura (Sem Billing Profile, Status Trialing)
INSERT INTO subscriptions (
team_id,
plan_id,
status,
current_period_start,
current_period_end -- Define o fim do trial aqui (ex: +7 dias)
)
VALUES (
1, -- Team ID recém criado
2, -- Plano escolhido
'trialing',
NOW(),
NOW() + INTERVAL '7 days'
);

####
