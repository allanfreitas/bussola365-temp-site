import React from "react";
import {
  MessageCircle,
  Layout,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bússola365 - Termos de Uso",
  description:
    "Leia nossos termos de uso para entender as condições de utilização da plataforma Bússola365.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto animate-fade-in">
        <Link
          href="/"
          className="flex items-center gap-2 text-jungle-green-500 hover:text-jungle-green-400 font-medium mb-12 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para a página inicial
        </Link>

        <div className="prose prose-invert prose-platinum max-w-none">
          <h1 className="text-4xl font-bold text-white mb-4">
            TERMOS E CONDIÇÕES GERAIS DE USO – BÚSSOLA365
          </h1>
          <p className="text-iron-grey-400 mb-8 italic text-sm">
            Última atualização: Dezembro de 2025
          </p>

          <div className="space-y-8 text-iron-grey-200 leading-relaxed">
            <p>
              Estes Termos e Condições Gerais de Uso ("Termos") regulam o acesso
              e a utilização da plataforma Bússola365, oferecida pela empresa{" "}
              <strong>Algolity Soluções e Sistemas LTDA</strong>, inscrita no
              CNPJ sob o nº <strong>37.527.475/0001-40</strong>, e são
              aplicáveis a todos os usuários e clientes ("Usuário", "Você"),
              através da contratação por assinatura de um dos nossos planos
              disponíveis no site oficial.
            </p>

            <p className="bg-prussian-blue-900/50 p-6 rounded-xl border border-prussian-blue-800 border-l-4 border-l-jungle-green-500">
              AO UTILIZAR A PLATAFORMA, VOCÊ AUTOMATICAMENTE CONCORDA COM ESTES
              TERMOS, QUE POSSUEM NATUREZA JURÍDICA DE CONTRATO DE ADESÃO. CASO
              NÃO CONCORDE COM QUALQUER CONDIÇÃO ABAIXO, VOCÊ NÃO DEVE UTILIZAR
              A PLATAFORMA.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">1.</span> Objeto
              </h2>
              <p>
                1.1. O Bússola365 é uma plataforma SaaS (Software as a Service)
                que oferece funcionalidades de análise de dados, dashboards e
                indicadores financeiros para pessoas físicas e empresas.
                <br />
                1.2. A utilização ocorre de forma 100% online, mediante
                assinatura ou plano contratado, utilizando infraestrutura em
                nuvem.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">2.</span> Cadastro,
                Conta de Usuário e Inatividade
              </h2>
              <p>
                2.1. Para utilizar o Bússola365, é necessário criar uma conta
                com informações verdadeiras, completas e atualizadas.
                <br />
                2.2. Você é o único responsável por manter a confidencialidade
                de sua senha e por todas as atividades que ocorram em sua conta.
                Não é permitido compartilhar suas credenciais de acesso com
                terceiros não autorizados.
                <br />
                2.3. Período de Teste: O Bússola365 é um produto pago, mas
                oferecemos um período de teste gratuito de 7 (sete) dias para
                novos cadastros.
                <br />
                2.4. Política de Inatividade e Exclusão de Dados: Serão
                excluídas permanentemente do nosso banco de dados todas as
                contas que não possuam uma assinatura ativa e que estejam sem
                qualquer atividade (login) por um período de 3 (três) meses.
              </p>
              <p className="mt-4 font-bold text-platinum-50">
                Atenção: Todos os dados da conta inativa serão excluídos e não
                poderão ser recuperados. Esta regra aplica-se apenas a contas
                Free ou sem vínculo com assinaturas pagas vigentes. Contas com
                licenças ativas não sofrerão exclusão por inatividade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">3.</span> Planos,
                Pagamentos e Cancelamento
              </h2>
              <p>
                3.1. O uso contínuo da plataforma após o período de teste está
                condicionado ao pagamento do plano escolhido, conforme valores
                informados no site oficial ou proposta comercial.
                <br />
                3.2. Renovação: Os planos funcionam no modelo de assinatura
                recorrente (mensal ou anual). As assinaturas são renovadas
                automaticamente ao término de cada ciclo, garantindo a
                continuidade do acesso.
                <br />
                3.3. Cancelamento: Você pode cancelar sua assinatura a qualquer
                momento através do painel do sistema. O cancelamento interrompe
                a cobrança futura, mas o acesso permanece ativo até o fim do
                ciclo já pago.
                <br />
                3.4. Reembolso e Direito de Arrependimento: Em conformidade com
                o Código de Defesa do Consumidor, garantimos o reembolso
                integral caso a solicitação seja feita em até 7 (sete) dias
                corridos após a primeira contratação (pagamento). Após este
                prazo de 7 dias, não haverá reembolso de valores já pagos
                (proporcionais ou integrais), visto que o serviço foi
                disponibilizado.
                <br />
                3.5. A falta de pagamento resultará na suspensão imediata do
                acesso à plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">4.</span> Uso Permitido
              </h2>
              <p>
                Você concorda em utilizar a plataforma de forma lícita,
                respeitando a legislação aplicável e a finalidade da ferramenta.
                É estritamente proibido:
                <br />
                4.1. Praticar engenharia reversa, descompilar ou tentar copiar o
                código-fonte do software.
                <br />
                4.2. Explorar falhas de segurança ou realizar testes de
                vulnerabilidade sem autorização.
                <br />
                4.3. Utilizar a plataforma para fins ilícitos, fraudulentos ou
                que prejudiquem terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">5.</span> Propriedade
                Intelectual
              </h2>
              <p>
                5.1. Todo o conteúdo, código, design, interfaces, logotipos e
                marcas do Bússola365 pertencem exclusivamente à Algolity
                Soluções e Sistemas LTDA.
                <br />
                5.2. O Usuário adquire apenas uma licença de uso temporária,
                revogável e não exclusiva, não adquirindo nenhum direito de
                propriedade sobre o software.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">6.</span> Privacidade e
                Proteção de Dados
              </h2>
              <p>
                6.1. O tratamento de dados pessoais segue as diretrizes da Lei
                Geral de Proteção de Dados (Lei 13.709/2018 - LGPD).
                <br />
                6.2. As informações coletadas serão utilizadas para o
                funcionamento da plataforma, processamento de pagamentos,
                melhoria dos serviços e cumprimento de obrigações legais.
                <br />
                6.3. Adotamos medidas de segurança técnicas e administrativas
                robustas para proteger seus dados, embora nenhum sistema seja
                absolutamente imune a ataques externos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">7.</span> Limitação de
                Responsabilidade
              </h2>
              <p>
                7.1. A plataforma é disponibilizada "como está" (as is). Embora
                trabalhemos para garantir alta disponibilidade, o software pode
                sofrer indisponibilidades temporárias para manutenção ou por
                motivos de força maior.
                <br />
                7.2. A Algolity Soluções e Sistemas LTDA não se responsabiliza
                por: Danos indiretos, lucros cessantes ou perda de receitas
                decorrentes do uso ou da impossibilidade de uso da plataforma;
                Decisões financeiras ou de gestão tomadas pelo Usuário com base
                nos dados gerados pela ferramenta. A responsabilidade pela
                análise e uso das informações é inteiramente do Usuário.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">8.</span> Suporte
              </h2>
              <p>
                8.1. O suporte técnico será prestado através dos canais oficiais
                informados no site (como e-mail ou chat), em dias úteis e
                horário comercial.
                <br />
                8.2. O nível de serviço (SLA) e tempo de resposta podem variar
                conforme o plano contratado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">9.</span> Alterações dos
                Termos
              </h2>
              <p>
                9.1. Estes Termos podem ser atualizados a qualquer momento. A
                version vigente estará sempre disponível no link oficial.
                <br />
                9.2. Caso haja alterações significativas que impactem os
                direitos dos usuários, enviaremos um comunicado através do
                e-mail cadastrado ou aviso na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">10.</span> Disposições
                Gerais
              </h2>
              <p>
                10.1. Se qualquer disposição destes Termos for considerada
                inválida ou inexequível, tal invalidade não afetará as demais
                disposições, que permanecerão em pleno vigor.
                <br />
                10.2. A tolerância de uma das partes quanto ao descumprimento de
                qualquer obrigação não significará renúncia ao direito de exigir
                o cumprimento da obrigação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">11.</span> Foro e
                Legislação Aplicável
              </h2>
              <p>
                11.1. Estes Termos são regidos pelas leis da República
                Federativa do Brasil.
                <br />
                11.2. Fica eleito o foro da Comarca de Governador Lindenberg -
                ES para dirimir quaisquer controvérsias oriundas deste contrato,
                com renúncia expressa a qualquer outro, por mais privilegiado
                que seja.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
