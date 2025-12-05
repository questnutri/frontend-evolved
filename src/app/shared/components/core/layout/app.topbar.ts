import { Component, inject, OnInit, signal, ViewChild, HostListener, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService, NotificationService } from "@qn/services";
import { NgIcon } from '@ng-icons/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';

interface NotificationItem {
    id: string;
    i18n: {
        'pt-BR': {
            title: string;
            message: string;
        }
    };
    createdAt: string;
    read: boolean;
    additionalData?: {
        achievement?: {
            icon?: string;
            rarity?: string;
        }
    };
}

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        NgIcon,
        PopoverModule,
        BadgeModule,
        DrawerModule
    ],
    template: `
        <div class="layout-topbar" [style.background]="'var(--primary-background-color)'">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
            </div>
            
            <div class="layout-topbar-center">
                <a class="layout-topbar-logo" routerLink="/profile">
                    <img [src]="logoSrc()" alt="Logo" width="70px" />
                </a>
            </div>

            <div class="layout-topbar-right">
                <button 
                    class="notification-btn" 
                    (click)="toggleNotifications($event)"
                    [class.has-unread]="unreadCount() > 0"
                >
                    <ng-icon name="heroBellSolid" size="24"></ng-icon>
                    @if(unreadCount() > 0) {
                        <span class="notification-badge">{{ unreadCount() > 9 ? '9+' : unreadCount() }}</span>
                    }
                </button>
            </div>
        </div>

        <!-- Desktop Popover -->
        @if(!isMobile()) {
            <p-popover #notificationPopover [style]="{ width: '360px' }">
                <ng-container *ngTemplateOutlet="notificationsContent"></ng-container>
            </p-popover>
        }

        <!-- Mobile Drawer -->
        <p-drawer 
            [(visible)]="drawerVisible" 
            position="right" 
            [style]="{ width: '100%', maxWidth: '400px' }"
            [modal]="true"
            [showCloseIcon]="false"
        >
            <ng-template pTemplate="header">
                <div class="drawer-header">
                    <h3>Notificações</h3>
                    <button class="drawer-close-btn" (click)="drawerVisible = false">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
            </ng-template>
            <ng-container *ngTemplateOutlet="notificationsContent"></ng-container>
        </p-drawer>

        <!-- Shared Notifications Content Template -->
        <ng-template #notificationsContent>
            <div class="notifications-panel">
                <div class="notifications-header" [class.in-drawer]="isMobile()">
                    @if(!isMobile()) {
                        <h3>Notificações</h3>
                    }
                    @if(unreadCount() > 0) {
                        <button class="mark-all-read" (click)="markAllAsRead()">
                            Marcar todas como lidas
                        </button>
                    }
                </div>

                @if(isLoading()) {
                    <div class="notifications-loading">
                        <i class="pi pi-spin pi-spinner"></i>
                        <span>Carregando...</span>
                    </div>
                } @else if(notifications().length === 0) {
                    <div class="notifications-empty">
                        <i class="pi pi-bell-slash"></i>
                        <p>Nenhuma notificação</p>
                    </div>
                } @else {
                    <div class="notifications-list" [class.in-drawer]="isMobile()">
                        @for(notification of notifications(); track notification.id) {
                            <div 
                                class="notification-item" 
                                [class.unread]="!notification.read"
                                (click)="markAsRead(notification)"
                            >
                                <div class="notification-icon" [ngClass]="'rarity-' + getRarity(notification)">
                                    @if(notification.additionalData?.achievement?.icon) {
                                        <span class="achievement-icon">{{ notification.additionalData?.achievement?.icon }}</span>
                                    } @else {
                                        <i class="pi pi-bell"></i>
                                    }
                                </div>
                                <div class="notification-content">
                                    <div class="notification-title">{{ notification.i18n['pt-BR'].title }}</div>
                                    <div class="notification-message">{{ notification.i18n['pt-BR'].message }}</div>
                                    <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
                                </div>
                                @if(!notification.read) {
                                    <div class="unread-dot"></div>
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        </ng-template>
    `,
    styles: [`
        .layout-topbar-center {
            position: absolute;
            left: 50vw;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .layout-topbar-right {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .notification-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border: none;
            background: transparent;
            border-radius: 50%;
            cursor: pointer;
            color: var(--text-color);
            transition: background-color 0.2s;

            &:hover {
                background-color: var(--surface-hover);
            }

            .notification-badge {
                position: absolute;
                top: 2px;
                right: 2px;
                min-width: 18px;
                height: 18px;
                padding: 0 5px;
                font-size: 0.7rem;
                font-weight: 600;
                color: white;
                background: #EF4444;
                border-radius: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: #1E293B;
            }

            .drawer-close-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2rem;
                height: 2rem;
                border: none;
                background: transparent;
                border-radius: 50%;
                cursor: pointer;
                color: #64748B;
                transition: all 0.2s;

                &:hover {
                    background: #F1F5F9;
                    color: #1E293B;
                }
            }
        }

        .notifications-panel {
            height: 100%;
            display: flex;
            flex-direction: column;

            .notifications-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #E2E8F0;
                margin-bottom: 0.75rem;

                &.in-drawer {
                    justify-content: flex-end;
                    padding-top: 0;
                }

                h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1E293B;
                }

                .mark-all-read {
                    border: none;
                    background: transparent;
                    color: #0891B2;
                    font-size: 0.75rem;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.2s;

                    &:hover {
                        background-color: #F0F9FF;
                    }
                }
            }

            .notifications-loading,
            .notifications-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem 1rem;
                color: #94A3B8;
                gap: 0.75rem;
                flex: 1;

                i {
                    font-size: 3rem;
                    opacity: 0.5;
                }

                p, span {
                    margin: 0;
                    font-size: 0.875rem;
                }
            }

            .notifications-list {
                max-height: 350px;
                overflow-y: auto;
                margin: -0.5rem;
                padding: 0.5rem;
                flex: 1;

                &.in-drawer {
                    max-height: none;
                }

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                &::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 2px;
                }
            }

            .notification-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.875rem;
                border-radius: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s;
                position: relative;
                margin-bottom: 0.5rem;

                &:hover {
                    background-color: #F8FAFC;
                }

                &.unread {
                    background-color: #F0F9FF;

                    &:hover {
                        background-color: #E0F2FE;
                    }
                }

                .notification-icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 1.25rem;

                    i {
                        font-size: 1rem;
                    }

                    .achievement-icon {
                        font-size: 1.25rem;
                    }

                    &.rarity-COMMON {
                        background: #E2E8F0;
                        color: #64748B;
                    }

                    &.rarity-RARE {
                        background: #DBEAFE;
                        color: #3B82F6;
                    }

                    &.rarity-EPIC {
                        background: #E9D5FF;
                        color: #9333EA;
                    }

                    &.rarity-LEGENDARY {
                        background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
                        color: #D97706;
                    }
                }

                .notification-content {
                    flex: 1;
                    min-width: 0;

                    .notification-title {
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #1E293B;
                        margin-bottom: 0.25rem;
                    }

                    .notification-message {
                        font-size: 0.8rem;
                        color: #64748B;
                        line-height: 1.4;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .notification-time {
                        font-size: 0.7rem;
                        color: #94A3B8;
                        margin-top: 0.375rem;
                    }
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: #0891B2;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 0.375rem;
                }
            }
        }
    `]
})
export class AppTopbar implements OnInit {
    @ViewChild('notificationPopover') notificationPopover!: Popover;

    private readonly notificationService = inject(NotificationService);
    public readonly layoutService = inject(LayoutService);

    // Add computed signal for logo source
    logoSrc = computed(() => {
        return this.layoutService.theme() == 'dark' ? 'logo/qn-dark-fit.svg' : 'logo/qn-fit.png';
    });

    items!: MenuItem[];
    notifications = signal<NotificationItem[]>([]);
    isLoading = signal(false);
    unreadCount = signal(0);
    isMobile = signal(false);
    drawerVisible = false;

    private readonly MOBILE_BREAKPOINT = 768;

    @HostListener('window:resize')
    onResize() {
        this.checkMobile();
    }

    ngOnInit() {
        this.checkMobile();
        this.loadNotifications();
    }

    private checkMobile() {
        this.isMobile.set(window.innerWidth < this.MOBILE_BREAKPOINT);
    }

    async loadNotifications() {
        this.isLoading.set(true);
        try {
            const data = await this.notificationService.getAll();
            this.notifications.set(data || []);
            this.updateUnreadCount();
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications.set([]);
        } finally {
            this.isLoading.set(false);
        }
    }

    updateUnreadCount() {
        const count = this.notifications().filter(n => !n.read).length;
        this.unreadCount.set(count);
    }

    toggleNotifications(event: Event) {
        if (this.isMobile()) {
            this.drawerVisible = true;
            this.loadNotifications();
        } else {
            this.notificationPopover.toggle(event);
            if (!this.notificationPopover.overlayVisible) {
                this.loadNotifications();
            }
        }
    }

    getRarity(notification: NotificationItem): string {
        return notification.additionalData?.achievement?.rarity || 'COMMON';
    }

    async markAsRead(notification: NotificationItem) {
        if (notification.read) return;

        try {
            // Call the service to acknowledge the notification
            await this.notificationService.ack(notification.id);

            // Update local state
            this.notifications.update(notifications =>
                notifications.map(n =>
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
            this.updateUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    async markAllAsRead() {
        try {
            // Call the service to acknowledge all notifications
            await this.notificationService.ackAll();

            // Update local state
            this.notifications.update(notifications =>
                notifications.map(n => ({ ...n, read: true }))
            );
            this.updateUnreadCount();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }

    formatTime(dateString: string): string {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) {
            return 'Agora mesmo';
        } else if (minutes < 60) {
            return `${minutes} min atrás`;
        } else if (hours < 24) {
            return `${hours}h atrás`;
        } else if (days < 7) {
            return `${days}d atrás`;
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
            });
        }
    }
}
