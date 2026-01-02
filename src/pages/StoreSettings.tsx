import { Clock, Calendar, History, Power, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoreSchedule } from '../types';

const StoreSettings = () => {
    const { storeInfo, updateStoreSchedule } = useApp();
    const [schedule, setSchedule] = useState<StoreSchedule>(storeInfo.schedule);
    const [hasChanges, setHasChanges] = useState(false);

    const daysOfWeek = [
        { value: 0, label: 'Sun' },
        { value: 1, label: 'Mon' },
        { value: 2, label: 'Tue' },
        { value: 3, label: 'Wed' },
        { value: 4, label: 'Thu' },
        { value: 5, label: 'Fri' },
        { value: 6, label: 'Sat' },
    ];

    const handleScheduleChange = (field: keyof StoreSchedule, value: any) => {
        setSchedule(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleDayToggle = (day: number) => {
        const newDays = schedule.daysOfWeek.includes(day)
            ? schedule.daysOfWeek.filter(d => d !== day)
            : [...schedule.daysOfWeek, day].sort();
        handleScheduleChange('daysOfWeek', newDays);
    };

    const handleSave = () => {
        updateStoreSchedule(schedule);
        setHasChanges(false);
    };

    const formatChangeType = (type: string) => {
        return type === 'manual' ? '👤 Manual' : '⏰ Automatic';
    };

    return (
        <div className="p-1 sm:p-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your store hours and availability</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Status */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Power size={20} className={storeInfo.isOpen ? 'text-emerald-500' : 'text-red-500'} />
                            Current Status
                        </h2>
                        <div className={`p-6 rounded-2xl border-2 ${storeInfo.isOpen ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-4 h-4 rounded-full ${storeInfo.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                <p className={`font-black text-xl ${storeInfo.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {storeInfo.isOpen ? 'Store Open' : 'Store Closed'}
                                </p>
                            </div>
                            {!storeInfo.isOpen && storeInfo.closeReason && (
                                <p className="text-sm text-gray-600 font-medium mb-2">
                                    Reason: {storeInfo.closeReason}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                Last changed: {new Date(storeInfo.lastStatusChange).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Schedule Configuration */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <SettingsIcon size={20} className="text-blue-500" />
                            Auto Open/Close Schedule
                        </h2>

                        {/* Enable/Disable Toggle */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">Enable Automatic Schedule</p>
                                    <p className="text-sm text-gray-500">Store will open/close based on set times</p>
                                </div>
                                <button
                                    onClick={() => handleScheduleChange('enabled', !schedule.enabled)}
                                    className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-inner ${schedule.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${schedule.enabled ? 'translate-x-11' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Time Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-emerald-500" />
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    value={schedule.openTime}
                                    onChange={(e) => handleScheduleChange('openTime', e.target.value)}
                                    disabled={!schedule.enabled}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-red-500" />
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    value={schedule.closeTime}
                                    onChange={(e) => handleScheduleChange('closeTime', e.target.value)}
                                    disabled={!schedule.enabled}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Days of Week */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" />
                                Operating Days
                            </label>
                            <div className="grid grid-cols-7 gap-2">
                                {daysOfWeek.map((day) => (
                                    <button
                                        key={day.value}
                                        onClick={() => handleDayToggle(day.value)}
                                        disabled={!schedule.enabled}
                                        className={`p-3 rounded-xl font-bold text-sm transition-all ${schedule.daysOfWeek.includes(day.value)
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        {hasChanges && (
                            <button
                                onClick={handleSave}
                                className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                Save Schedule Settings
                            </button>
                        )}

                        {/* Schedule Summary */}
                        {schedule.enabled && !hasChanges && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm font-bold text-blue-700 text-center">
                                    ⏰ Store will automatically open at {schedule.openTime} and close at {schedule.closeTime}
                                </p>
                                <p className="text-xs text-blue-600 text-center mt-1">
                                    Operating on: {schedule.daysOfWeek.map(d => daysOfWeek.find(day => day.value === d)?.label).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Change History */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History size={20} className="text-purple-500" />
                    Status Change History
                </h2>
                <div className="overflow-x-auto">
                    {storeInfo.statusLogs.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <th className="pb-4 font-bold">Timestamp</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold">Type</th>
                                    <th className="pb-4 font-bold">Reason</th>
                                    <th className="pb-4 font-bold">Changed By</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-50">
                                {storeInfo.statusLogs.slice(0, 20).map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-xs text-gray-500">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${log.status === 'open'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border border-red-200'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm font-medium text-gray-700">
                                            {formatChangeType(log.changeType)}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">
                                            {log.reason || '-'}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">
                                            {log.changedBy || 'Mart Owner'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                            <History className="mx-auto text-gray-200 mb-3" size={48} />
                            <p className="text-gray-400 font-medium">No status changes recorded yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreSettings;
