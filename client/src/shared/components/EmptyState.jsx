import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div className="py-16 text-center p-8 rounded-3xl bg-white dark:bg-dark-card border border-dashed border-gray-300 dark:border-gray-700/80 space-y-3">
      {Icon && <Icon className="w-12 h-12 text-gray-400 mx-auto" />}
      <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-brand hover:opacity-95 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
