import React from "react";
import {
  MessageCircle,
  Layout,
  Users,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
} from "lucide-react";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-prussian-blue-900/50 border border-prussian-blue-800 p-8 rounded-2xl hover:border-jungle-green-500/50 transition-all duration-300 group">
    <div className="bg-prussian-blue-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-platinum-50">{title}</h3>
    <p className="text-iron-grey-300 leading-relaxed">{description}</p>
  </div>
);

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-44 pb-24 px-6 overflow-hidden relative">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-steel-azure-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-jungle-green-600/10 rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-prussian-blue-900 border border-prussian-blue-800 text-sm font-medium text-steel-azure-300 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jungle-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-jungle-green-500"></span>
            </span>
            Em breve para você
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Suas finanças na <br />
            <span className="gradient-text">palma da sua mão</span>
          </h1>

          <p className="text-xl md:text-2xl text-iron-grey-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gerencie receitas e despesas sem sair do WhatsApp. Controle total,
            relatórios em tempo real e compartilhamento familiar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* <button className="px-8 py-4 bg-jungle-green-500 hover:bg-jungle-green-400 text-prussian-blue-950 font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              Ficar por dentro <ArrowRight className="w-5 h-5" />
            </button> */}
            <a
              href="#funcionalidades"
              className="px-8 py-4 bg-prussian-blue-900 hover:bg-prussian-blue-800 text-white font-semibold rounded-xl transition-all"
            >
              Ver funcionalidades
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-24 bg-prussian-blue-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Pensados em Você
            </h2>
            <p className="text-iron-grey-400 max-w-xl mx-auto">
              Simplicidade é a nossa bússola. Criamos uma ferramenta que se
              adapta à sua rotina, não o contrário.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="text-jungle-green-400 w-6 h-6" />}
              title="Controle via WhatsApp"
              description="Lance e consulte suas despesas e receitas diretamente pelo WhatsApp. Sem formulários complexos, apenas uma mensagem rápida."
            />
            <FeatureCard
              icon={<Layout className="text-steel-azure-400 w-6 h-6" />}
              title="Painel Web Responsivo"
              description="Acesse um dashboard completo para análises detalhadas, alterações de registros e uma visão 360° da sua saúde financeira."
            />
            <FeatureCard
              icon={<Users className="text-platinum-400 w-6 h-6" />}
              title="Compartilhamento Plus"
              description="Compartilhe sua conta com um parceiro ou familiar via WhatsApp. Gestão conjunta para quem planeja o futuro a dois."
            />
          </div>
        </div>
      </section>

      {/* Status / Development Section */}
      <section
        id="desenvolvimento"
        className="py-24 border-t border-prussian-blue-900"
      >
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-prussian-blue-900 to-prussian-blue-950 p-12 rounded-[2rem] border border-prussian-blue-800 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Clock className="w-48 h-48" />
            </div>

            <CheckCircle2 className="w-16 h-16 text-jungle-green-500 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Estamos em Desenvolvimento
            </h2>
            <p className="text-iron-grey-300 text-lg max-w-2xl mb-10 leading-relaxed">
              Estamos polindo cada detalhe para garantir que o Bússola365 seja a
              melhor ferramenta de gestão que você já usou. Nossa equipe está
              trabalhando duro na integração segura com o WhatsApp e em um
              painel web intuitivo.
            </p>
            <div className="bg-prussian-blue-800/50 px-6 py-3 rounded-full text-steel-azure-300 font-medium border border-steel-azure-900/50">
              Disponível em Breve • 2026
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
