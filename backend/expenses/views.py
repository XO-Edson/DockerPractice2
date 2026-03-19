from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]

    def get_queryset(self):
        return Category.objects.annotate(
            expense_count=Count("expenses"),
            total_spent=Sum("expenses__amount"),
        )


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["description", "notes"]
    ordering_fields = ["date", "amount", "created_at"]

    def get_queryset(self):
        qs = Expense.objects.select_related("category")

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category_id=category)

        date_from = self.request.query_params.get("date_from")
        if date_from:
            qs = qs.filter(date__gte=date_from)

        date_to = self.request.query_params.get("date_to")
        if date_to:
            qs = qs.filter(date__lte=date_to)

        return qs

    @action(detail=False, methods=["get"])
    def summary(self, request):
        qs = self.get_queryset()

        total = qs.aggregate(total=Sum("amount"))["total"] or 0
        count = qs.count()

        by_category = (
            qs.values("category__id", "category__name", "category__color")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")
        )

        by_month = (
            qs.annotate(month=TruncMonth("date"))
            .values("month")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("month")
        )

        return Response(
            {
                "total": total,
                "count": count,
                "by_category": list(by_category),
                "by_month": [
                    {
                        "month": entry["month"].strftime("%Y-%m"),
                        "total": entry["total"],
                        "count": entry["count"],
                    }
                    for entry in by_month
                ],
            }
        )
