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
  title: "Bússola365 - Política de Privacidade",
  description:
    "Leia nossa política de privacidade para entender como protegemos seus dados pessoais na Bússola365.",
};

export default function PrivacyPolicyPage() {
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
            POLÍTICA DE PRIVACIDADE – BÚSSOLA365
          </h1>
          <p className="text-iron-grey-400 mb-8 italic text-sm">
            Última atualização: Dezembro de 2025
          </p>

          <div className="space-y-8 text-iron-grey-200 leading-relaxed">
            <p>
              A sua privacidade é prioridade para a{" "}
              <strong>Algolity Soluções e Sistemas LTDA</strong> (doravante
              "Bússola365" ou "Nós"). Esta Política de Privacidade descreve como
              coletamos, usamos, armazenamos e protegemos seus dados pessoais ao
              utilizar nossa plataforma, em conformidade com a Lei Geral de
              Proteção de Dados (Lei nº 13.709/2018 - "LGPD").
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">1.</span> Controlador
                dos Dados
              </h2>
              <p>
                O controlador dos seus dados pessoais é a{" "}
                <strong>Algolity Soluções e Sistemas LTDA</strong>, pessoa
                jurídica inscrita no CNPJ sob o nº{" "}
                <strong>37.527.475/0001-40</strong>, com sede na cidade de
                Governador Lindenberg - ES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">2.</span> Quais dados
                coletamos e em que momento?
              </h2>
              <p>
                Nós coletamos o mínimo necessário de informações para oferecer
                nossos serviços, dividindo a coleta em duas etapas distintas:
              </p>
              <div className="space-y-4 mt-4">
                <div className="bg-prussian-blue-900/40 p-5 rounded-xl border border-prussian-blue-800">
                  <h3 className="text-lg font-bold text-platinum-100 mb-2">
                    2.1. Dados de Acesso (Período de Teste/Cadastro Inicial)
                  </h3>
                  <p>
                    Para liberar o seu acesso ao período de teste gratuito de 7
                    dias, coletamos apenas dados básicos de identificação e uso
                    do sistema: Nome, Telefone (para liberação de acesso via
                    whatsapp), Endereço de e-mail e Senha de acesso (armazenada
                    de forma criptografada).
                  </p>
                </div>
                <div className="bg-prussian-blue-900/40 p-5 rounded-xl border border-prussian-blue-800">
                  <h3 className="text-lg font-bold text-platinum-100 mb-2">
                    2.2. Dados de Faturamento e Conformidade Legal (Assinatura)
                  </h3>
                  <p>
                    Apenas no momento da contratação efetiva de um plano,
                    solicitaremos dados adicionais obrigatórios: CPF ou CNPJ,
                    Razão Social, Endereço completo, Telefone de contato e Dados
                    financeiros.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">3.</span> Para que
                utilizamos seus dados? (Finalidade)
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Prestação do Serviço:</strong> Permitir o acesso e
                  funcionamento das ferramentas de gestão financeira e
                  dashboards.
                </li>
                <li>
                  <strong>Faturamento e Fiscal:</strong> Processar pagamentos e
                  emitir notas fiscais.
                </li>
                <li>
                  <strong>Comunicação:</strong> Enviar avisos importantes sobre
                  sua conta e atualizações.
                </li>
                <li>
                  <strong>Segurança:</strong> Prevenção à fraude e garantia da
                  segurança da plataforma.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">4.</span>{" "}
                Compartilhamento de Dados
              </h2>
              <p>
                Não vendemos nem alugamos seus dados pessoais. O
                compartilhamento ocorre apenas com parceiros estritamente
                necessários: Processadores de Pagamento, Serviços de Hospedagem
                e Autoridades Públicas (quando exigido por lei).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">5.</span> Retenção e
                Exclusão de Dados
              </h2>
              <p>
                <strong>Contas Inativas:</strong> Conforme nossos Termos de Uso,
                contas gratuitas sem assinatura e sem atividade por 3 meses
                serão excluídas permanentemente.
                <br />
                <strong>Dados Fiscais:</strong> Dados financeiros e notas
                fiscais serão mantidos pelo prazo legal exigido pela legislação
                tributária (geralmente 5 anos).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">6.</span> Seus Direitos
                (Titular dos Dados)
              </h2>
              <p>
                De acordo com a LGPD, você tem direito a confirmar a existência
                de tratamento, acessar seus dados, corrigir informações,
                solicitar exclusão (respeitados os prazos legais) e revogar seu
                consentimento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">7.</span> Segurança da
                Informação
              </h2>
              <p>
                Adotamos práticas robustas de segurança, incluindo criptografia
                em trânsito (HTTPS/SSL) e no armazenamento de senhas. O usuário
                também é responsável por manter suas credenciais seguras.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">8.</span> Alterações
                nesta Política
              </h2>
              <p>
                Podemos atualizar esta política periodicamente. A versão
                atualizada estará sempre disponível no link oficial de Política
                de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-jungle-green-500">9.</span> Foro
              </h2>
              <p>
                Esta Política é regida pelas leis brasileiras. Fica eleito o
                foro da Comarca de Governador Lindenberg - ES para dirimir
                quaisquer dúvidas decorrentes deste documento.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
