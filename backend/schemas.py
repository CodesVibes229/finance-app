from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# Income schemas
class IncomeCreate(BaseModel):
    amount: float
    category: str
    date: date


class IncomeUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None


class IncomeResponse(BaseModel):
    id: int
    amount: float
    category: str
    date: date
    user_id: int

    class Config:
        from_attributes = True


# Expense schemas
class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date
    comment: Optional[str] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None
    comment: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    date: date
    comment: Optional[str]
    user_id: int

    class Config:
        from_attributes = True


# Budget schemas
class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: int
    year: int


class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    month: Optional[int] = None
    year: Optional[int] = None


class BudgetResponse(BaseModel):
    id: int
    category: str
    amount: float
    month: int
    year: int
    user_id: int

    class Config:
        from_attributes = True


# Savings Goal schemas
class SavingsGoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: Optional[float] = 0.0
    target_date: Optional[date] = None


class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[date] = None


class SavingsGoalResponse(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    target_date: Optional[date]
    user_id: int

    class Config:
        from_attributes = True


# Dashboard schemas
class CategoryStats(BaseModel):
    category: str
    amount: float


class MonthlyEvolution(BaseModel):
    month: str
    income: float
    expenses: float


class DashboardStats(BaseModel):
    balance: float
    total_income: float
    total_expenses: float
    monthly_income: float
    monthly_expenses: float
    category_stats: List[CategoryStats]
    monthly_evolution: List[dict]
    health_status: str
